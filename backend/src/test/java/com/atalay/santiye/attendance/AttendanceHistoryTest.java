package com.atalay.santiye.attendance;

import static org.assertj.core.api.Assertions.assertThat;

import com.atalay.santiye.support.ApiTestSupport;
import com.atalay.santiye.support.IntegrationTest;
import com.jayway.jsonpath.JsonPath;
import jakarta.servlet.http.Cookie;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.ZoneId;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.junit.jupiter.api.Test;

@IntegrationTest
class AttendanceHistoryTest extends ApiTestSupport {

    private static final LocalDate TODAY = LocalDate.now(ZoneId.of("Europe/Istanbul"));
    /** Aynı ayın iki günü: ayın ilk günü çalışsa bile test başka aya taşmaz. */
    private static final LocalDate LATER = TODAY.getDayOfMonth() > 1 ? TODAY : TODAY.minusDays(1);
    private static final LocalDate EARLIER = LATER.minusDays(1);
    private static final String MONTH = YearMonth.from(LATER).toString();

    private String addWorker(Cookie session, String siteId, String fullName) {
        String json = "{\"fullName\": \"%s\"}".formatted(fullName);
        return read(contentOf(postJson("/api/sites/" + siteId + "/workers", session, json)), "$.id");
    }

    private void take(Cookie session, String siteId, LocalDate day, String entriesJson) {
        assertThat(postJson("/api/sites/" + siteId + "/attendance/" + day, session, "{\"entries\": " + entriesJson + "}"))
            .hasStatus(201);
    }

    private static String mark(String workerId, String status, String reason) {
        String why = reason == null ? "null" : "\"" + reason + "\"";
        return "{\"workerId\": \"%s\", \"status\": \"%s\", \"reason\": %s}".formatted(workerId, status, why);
    }

    @Test
    void siteAndWorkerMonthsShowEachDayNewestFirst() {
        Cookie owner = loginAsOwner();
        String siteId = createSite(owner, "Geçmiş " + UUID.randomUUID());
        String ali = addWorker(owner, siteId, "Ali Usta");
        String veli = addWorker(owner, siteId, "Veli Kaya");
        take(owner, siteId, EARLIER, "[%s, %s]".formatted(mark(ali, "PRESENT", null), mark(veli, "ABSENT", "SICK")));
        take(owner, siteId, LATER, "[%s, %s]".formatted(mark(ali, "PRESENT", null), mark(veli, "EXCUSED", null)));

        String site = contentOf(get("/api/sites/" + siteId + "/attendance?month=" + MONTH, owner));
        assertThat(JsonPath.<List<String>>read(site, "$.days[*].day")).containsExactly(LATER.toString(), EARLIER.toString());
        assertThat(JsonPath.<Map<String, Integer>>read(site, "$.totals"))
            .containsEntry("present", 2).containsEntry("absent", 1).containsEntry("excused", 1);
        assertThat(JsonPath.<Integer>read(site, "$.workerCount")).isEqualTo(2);

        String worker = contentOf(get("/api/workers/" + veli + "/attendance?month=" + MONTH, owner));
        assertThat(read(worker, "$.worker.fullName")).isEqualTo("Veli Kaya");
        assertThat(JsonPath.<List<String>>read(worker, "$.days[*].status")).containsExactly("EXCUSED", "ABSENT");
        assertThat(read(worker, "$.days[1].reason")).isEqualTo("SICK");
    }

    @Test
    void theOverviewShowsTodayAndTheLastDayForEachSite() {
        Cookie owner = loginAsOwner();
        String taken = createSite(owner, "Bugün alınan " + UUID.randomUUID());
        String untouched = createSite(owner, "Hiç alınmayan " + UUID.randomUUID());
        String ali = addWorker(owner, taken, "Ali Usta");
        take(owner, taken, TODAY, "[%s]".formatted(mark(ali, "ABSENT", "UNEXCUSED")));

        String overview = contentOf(get("/api/attendance/overview", owner));
        String site = "$[?(@.siteId == '%s')]";
        assertThat(JsonPath.<List<Integer>>read(overview, site.formatted(taken) + ".today.absent")).containsExactly(1);
        assertThat(JsonPath.<List<String>>read(overview, site.formatted(taken) + ".lastDay")).containsExactly(TODAY.toString());
        assertThat(JsonPath.<List<Integer>>read(overview, site.formatted(taken) + ".workerCount")).containsExactly(1);
        assertThat(JsonPath.<List<Object>>read(overview, site.formatted(untouched) + ".today")).containsExactly((Object) null);
    }

    /** Yoklama ekranının Geçmiş'i: bütün şantiyelerin günleri toplanır; bugün ve iki haftadan eskisi gelmez. */
    @Test
    void recentDaysSumEverySiteAndLeaveTodayOut() {
        Cookie owner = loginAsOwner();
        String camlica = createSite(owner, "Son günler " + UUID.randomUUID());
        String avrupa = createSite(owner, "Son günler " + UUID.randomUUID());
        String ali = addWorker(owner, camlica, "Ali Usta");
        String veli = addWorker(owner, avrupa, "Veli Kaya");
        LocalDate tenDaysAgo = TODAY.minusDays(10);
        take(owner, camlica, tenDaysAgo, "[%s]".formatted(mark(ali, "PRESENT", null)));
        take(owner, avrupa, tenDaysAgo, "[%s]".formatted(mark(veli, "ABSENT", "SICK")));
        take(owner, camlica, TODAY.minusDays(20), "[%s]".formatted(mark(ali, "PRESENT", null)));
        take(owner, avrupa, TODAY, "[%s]".formatted(mark(veli, "PRESENT", null)));

        String days = contentOf(get("/api/attendance/days", owner));
        String day = "$[?(@.day == '%s')]";
        assertThat(JsonPath.<List<Integer>>read(days, day.formatted(tenDaysAgo) + ".counts.present")).containsExactly(1);
        assertThat(JsonPath.<List<Integer>>read(days, day.formatted(tenDaysAgo) + ".counts.absent")).containsExactly(1);
        assertThat(JsonPath.<List<Object>>read(days, day.formatted(TODAY.minusDays(20)))).isEmpty();
        assertThat(JsonPath.<List<Object>>read(days, day.formatted(TODAY))).isEmpty();
        assertThat(JsonPath.<List<String>>read(days, "$[*].day")).isSortedAccordingTo(Comparator.reverseOrder());
    }

    /** Firmadaki herkes her şantiyenin geçmişini görür; bulunmayan kayıt 404, bozuk ay 400'dür. */
    @Test
    void unknownRecordsAreNotFoundAndTheMonthMustBeValid() {
        Cookie owner = loginAsOwner();
        String siteId = createSite(owner, "Geçmiş " + UUID.randomUUID());
        Cookie lead = signedInLead(owner, "Geçmişe Bakan Şef");
        String unknown = UUID.randomUUID().toString();

        assertThat(get("/api/workers/" + unknown + "/attendance?month=" + MONTH, lead)).hasStatus(404);
        assertThat(get("/api/sites/" + unknown + "/attendance?month=" + MONTH, lead)).hasStatus(404);
        assertThat(get("/api/sites/" + siteId + "/attendance?month=eylul", lead)).hasStatus(400);
        assertThat(contentOf(get("/api/attendance/overview", lead))).contains(siteId);
    }
}
