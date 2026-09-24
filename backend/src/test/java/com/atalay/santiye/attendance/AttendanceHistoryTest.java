package com.atalay.santiye.attendance;

import static org.assertj.core.api.Assertions.assertThat;

import com.atalay.santiye.support.ApiTestSupport;
import com.atalay.santiye.support.IntegrationTest;
import com.jayway.jsonpath.JsonPath;
import jakarta.servlet.http.Cookie;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.ZoneId;
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

    @Test
    void historyFollowsSiteVisibilityAndNeedsAValidMonth() {
        Cookie owner = loginAsOwner();
        String ownSite = createSite(owner, "Kendi " + UUID.randomUUID());
        String otherSite = createSite(owner, "Başka " + UUID.randomUUID());
        String stranger = addWorker(owner, otherSite, "Yabancı Usta");
        Cookie lead = signedInSiteLead(owner, "Sınırlı Şef", ownSite);

        assertThat(get("/api/workers/" + stranger + "/attendance?month=" + MONTH, lead)).hasStatus(404);
        assertThat(get("/api/sites/" + otherSite + "/attendance?month=" + MONTH, lead)).hasStatus(404);
        assertThat(get("/api/sites/" + ownSite + "/attendance?month=eylul", lead)).hasStatus(400);
        assertThat(contentOf(get("/api/attendance/overview", lead))).contains(ownSite).doesNotContain(otherSite);
    }
}
