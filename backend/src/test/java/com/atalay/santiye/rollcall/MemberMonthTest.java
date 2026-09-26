package com.atalay.santiye.rollcall;

import static org.assertj.core.api.Assertions.assertThat;

import com.atalay.santiye.support.ApiTestSupport;
import com.atalay.santiye.support.IntegrationTest;
import com.jayway.jsonpath.JsonPath;
import jakarta.servlet.http.Cookie;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.ZoneId;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;

@IntegrationTest
class MemberMonthTest extends ApiTestSupport {

    /**
     * Geçen ay: bugünden geriye sayılan günler ayın başında önceki aya taşardı; sabit günler kararlıdır. Kişinin
     * takvimini gösteren test geçen ayı, "sonradan katılan" testi bir önceki ayı kullanır: birinin yoklama günü
     * ötekinin kişisinde "katılmadı" görünmesin.
     */
    private static final YearMonth LAST_MONTH = YearMonth.now(ZoneId.of("Europe/Istanbul")).minusMonths(1);

    @Autowired
    private JdbcTemplate jdbc;

    private void mark(Cookie owner, String memberId, int dayOfMonth, String json) {
        LocalDate day = LAST_MONTH.atDay(dayOfMonth);
        assertThat(putJson("/api/roll-calls/days/%s/members/%s".formatted(day, memberId), owner, json)).hasStatusOk();
    }

    /** O gün bir şantiyede yoklama mesajı atılmış olsun: mesaj bugün atılır, günü geriye çekilir. */
    private void rollCallOn(Cookie owner, LocalDate day) {
        String siteId = createSite(owner, "Geçen ay " + UUID.randomUUID());
        String postId = read(contentOf(postJson("/api/sites/" + siteId + "/roll-calls", owner, "{}")), "$.id");
        jdbc.update("update posts set roll_call_day = ? where id = ?", day, UUID.fromString(postId));
    }

    @Test
    void theCalendarColoursPresentAbsentExcusedAndMissedDays() {
        Cookie owner = loginAsOwner();
        String memberId = userIdOf(signedInLead(owner, "Takvim Ustası"));
        jdbc.update("update users set created_at = created_at - interval '70 days' where id = ?",
            UUID.fromString(memberId));
        mark(owner, memberId, 10, "{\"status\": \"PRESENT\"}");
        mark(owner, memberId, 11, "{\"status\": \"ABSENT\", \"reason\": \"SICK\"}");
        mark(owner, memberId, 12, "{\"status\": \"EXCUSED\"}");
        rollCallOn(owner, LAST_MONTH.atDay(13));

        String month = contentOf(get("/api/roll-calls/members/%s?month=%s".formatted(memberId, LAST_MONTH), owner));

        Map<String, Object> days = testDays(month);
        assertThat(days).containsOnlyKeys(dayOf(10), dayOf(11), dayOf(12), dayOf(13));
        assertThat(days.get(dayOf(10))).isEqualTo("PRESENT");
        assertThat(days.get(dayOf(11))).isEqualTo("ABSENT · SICK");
        assertThat(days.get(dayOf(12))).isEqualTo("EXCUSED");
        assertThat(days.get(dayOf(13))).isEqualTo("MISSED");
        assertThat((Integer) JsonPath.read(month, "$.counts.excused")).isEqualTo(1);
    }

    /**
     * Testler aynı firmayı paylaşır; başka testin yoklama günü bu kişide "katılmadı" görünebilir. Yalnızca bu
     * testin günlerine (10-13) bakılır: gün → "PRESENT", "ABSENT · SICK", "EXCUSED" ya da "MISSED".
     */
    private static Map<String, Object> testDays(String month) {
        List<Map<String, Object>> days = JsonPath.read(month, "$.days");
        Map<String, Object> byDay = new LinkedHashMap<>();
        days.stream().filter(day -> List.of(dayOf(10), dayOf(11), dayOf(12), dayOf(13)).contains(day.get("day")))
            .forEach(day -> byDay.put((String) day.get("day"), describe(day.get("record"))));
        return byDay;
    }

    @SuppressWarnings("unchecked")
    private static String describe(Object record) {
        if (record == null) {
            return "MISSED";
        }
        Map<String, Object> fields = (Map<String, Object>) record;
        Object reason = fields.get("reason");
        return reason == null ? (String) fields.get("status") : fields.get("status") + " · " + reason;
    }

    private static String dayOf(int dayOfMonth) {
        return LAST_MONTH.atDay(dayOfMonth).toString();
    }

    @Test
    void someoneWhoJoinedLaterDidNotMissEarlierRollCalls() {
        Cookie owner = loginAsOwner();
        String newcomerId = userIdOf(signedInLead(owner, "Sonradan Gelen"));
        YearMonth earlier = LAST_MONTH.minusMonths(1);
        rollCallOn(owner, earlier.atDay(5));

        String month = contentOf(get("/api/roll-calls/members/%s?month=%s".formatted(newcomerId, earlier), owner));

        assertThat((List<Object>) JsonPath.read(month, "$.days")).isEmpty();
    }

    @Test
    void onlyTheOwnerSeesSomeonesCalendar() {
        Cookie owner = loginAsOwner();
        Cookie lead = signedInLead(owner, "Başkasına Bakan");

        assertThat(get("/api/roll-calls/members/%s?month=%s".formatted(userIdOf(lead), LAST_MONTH), lead))
            .hasStatus(403);
        assertThat(get("/api/roll-calls/members/%s?month=%s".formatted(userIdOf(owner), LAST_MONTH), owner))
            .hasStatus(400);
    }
}
