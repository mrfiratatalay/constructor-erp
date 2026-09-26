package com.atalay.santiye.rollcall;

import static org.assertj.core.api.Assertions.assertThat;

import com.atalay.santiye.support.ApiTestSupport;
import com.atalay.santiye.support.IntegrationTest;
import com.jayway.jsonpath.JsonPath;
import jakarta.servlet.http.Cookie;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.assertj.MvcTestResult;

@IntegrationTest
class RollCallDayTest extends ApiTestSupport {

    /** Uygulamanın "bugün"ü şantiyenin saatine göredir (app.timezone). */
    private static final LocalDate TODAY = LocalDate.now(ZoneId.of("Europe/Istanbul"));

    /** Testler aynı firmayı paylaşır: sayılara değil, testin kendi kişisinin satırına bakılır. */
    private static List<Object> rowOf(String dayJson, String userId, String field) {
        return JsonPath.read(dayJson, "$.members[?(@.member.id == '%s')].%s".formatted(userId, field));
    }

    private MvcTestResult mark(Cookie session, LocalDate day, String userId, String json) {
        return putJson("/api/roll-calls/days/%s/members/%s".formatted(day, userId), session, json);
    }

    @Test
    void theOwnerSeesWhoJoinedAndWhoDidNot() {
        Cookie owner = loginAsOwner();
        String siteName = "Bugün " + UUID.randomUUID();
        String siteId = createSite(owner, siteName);
        Cookie joined = signedInLead(owner, "Erken Gelen");
        Cookie missing = signedInLead(owner, "Gelmeyen Usta");
        String postId = read(contentOf(postJson("/api/sites/" + siteId + "/roll-calls", owner, "{}")), "$.id");
        postJson("/api/roll-calls/" + postId + "/check-in", joined, "{}");

        String day = contentOf(get("/api/roll-calls/days/" + TODAY, owner));

        assertThat(rowOf(day, userIdOf(joined), "record.status")).containsExactly("PRESENT");
        assertThat(rowOf(day, userIdOf(joined), "record.siteName")).containsExactly(siteName);
        assertThat(rowOf(day, userIdOf(missing), "record")).containsExactly((Object) null);
        assertThat(rowOf(day, userIdOf(owner), "member")).isEmpty();
    }

    @Test
    void theOwnerMarksSomeoneWhoDidNotJoin() {
        Cookie owner = loginAsOwner();
        String sickId = userIdOf(signedInLead(owner, "Hasta Usta"));

        String day = contentOf(mark(owner, TODAY, sickId, "{\"status\": \"ABSENT\", \"reason\": \"SICK\"}"));

        assertThat(rowOf(day, sickId, "record.status")).containsExactly("ABSENT");
        assertThat(rowOf(day, sickId, "record.reason")).containsExactly("SICK");
        assertThat(rowOf(day, sickId, "record.markedByName")).containsExactly("Patron");
    }

    @Test
    void absentNeedsAReasonAndTheFutureCannotBeMarked() {
        Cookie owner = loginAsOwner();
        String memberId = userIdOf(signedInLead(owner, "Kuralcı Usta"));

        assertThat(mark(owner, TODAY, memberId, "{\"status\": \"ABSENT\"}")).hasStatus(400);
        assertThat(mark(owner, TODAY.plusDays(1), memberId, "{\"status\": \"EXCUSED\"}")).hasStatus(400);
        assertThat(mark(owner, TODAY, userIdOf(owner), "{\"status\": \"EXCUSED\"}")).hasStatus(400);
    }

    @Test
    void someoneWhoJoinedTheCompanyTodayIsNotMissingYesterday() {
        Cookie owner = loginAsOwner();
        String newcomerId = userIdOf(signedInLead(owner, "Yeni Gelen"));

        String yesterday = contentOf(get("/api/roll-calls/days/" + TODAY.minusDays(1), owner));

        assertThat(rowOf(yesterday, newcomerId, "member")).isEmpty();
    }

    @Test
    void onlyTheOwnerSeesTheRoll() {
        Cookie owner = loginAsOwner();
        Cookie lead = signedInLead(owner, "Meraklı Şef");

        assertThat(get("/api/roll-calls/days/" + TODAY, lead)).hasStatus(403);
        assertThat(mark(lead, TODAY, userIdOf(lead), "{\"status\": \"PRESENT\"}")).hasStatus(403);
    }
}
