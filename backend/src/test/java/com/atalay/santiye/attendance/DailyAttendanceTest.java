package com.atalay.santiye.attendance;

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

@IntegrationTest
class DailyAttendanceTest extends ApiTestSupport {

    private static final LocalDate TODAY = LocalDate.now(ZoneId.of("Europe/Istanbul"));
    private static final String TODAY_URI = "/api/attendance/days/" + TODAY;

    private String addWorker(Cookie session, String siteId, String fullName) {
        String json = "{\"fullName\": \"%s\"}".formatted(fullName);
        return read(contentOf(postJson("/api/sites/" + siteId + "/workers", session, json)), "$.id");
    }

    private static String site(String siteId, String workerId, String status, String reason) {
        String why = reason == null ? "null" : "\"" + reason + "\"";
        return "{\"siteId\": \"%s\", \"entries\": [{\"workerId\": \"%s\", \"status\": \"%s\", \"reason\": %s}]}"
            .formatted(siteId, workerId, status, why);
    }

    private static String sheetOf(String siteId) {
        return "$[?(@.siteId == '%s')]".formatted(siteId);
    }

    @Test
    void theScreenListsEveryActiveSiteWithItsPeople() {
        Cookie owner = loginAsOwner();
        String camlica = createSite(owner, "Günlük Çamlıca " + UUID.randomUUID());
        String finished = createSite(owner, "Biten " + UUID.randomUUID());
        addWorker(owner, camlica, "Ali Usta");
        assertThat(putJson("/api/sites/" + finished, owner, "{\"name\": \"Biten\", \"status\": \"COMPLETED\"}"))
            .hasStatusOk();

        String sheets = contentOf(get(TODAY_URI, owner));
        assertThat(JsonPath.<List<String>>read(sheets, sheetOf(camlica) + ".workers[*].fullName"))
            .containsExactly("Ali Usta");
        assertThat(JsonPath.<List<Object>>read(sheets, sheetOf(camlica) + ".day.recordedAt")).containsExactly((Object) null);
        assertThat(JsonPath.<List<Object>>read(sheets, sheetOf(finished))).isEmpty();
    }

    @Test
    void oneSaveTakesEverySiteAndASecondSaveCorrectsIt() {
        Cookie owner = loginAsOwner();
        String camlica = createSite(owner, "Günlük Çamlıca " + UUID.randomUUID());
        String avrupa = createSite(owner, "Günlük Avrupa " + UUID.randomUUID());
        String ali = addWorker(owner, camlica, "Ali Usta");
        String veli = addWorker(owner, avrupa, "Veli Kaya");

        String both = "{\"sites\": [%s, %s]}".formatted(site(camlica, ali, "PRESENT", null),
            site(avrupa, veli, "ABSENT", "SICK"));
        assertThat(putJson(TODAY_URI, owner, both)).hasStatusOk();
        String avrupaDay = contentOf(get("/api/sites/" + avrupa + "/attendance/" + TODAY, owner));
        assertThat(read(avrupaDay, "$.recordedByName")).isEqualTo("Patron");
        assertThat(read(avrupaDay, "$.entries[0].reason")).isEqualTo("SICK");

        String corrected = contentOf(putJson(TODAY_URI, owner,
            "{\"sites\": [%s]}".formatted(site(avrupa, veli, "EXCUSED", null))));
        assertThat(JsonPath.<List<Integer>>read(corrected, sheetOf(avrupa) + ".day.counts.excused")).containsExactly(1);
        assertThat(JsonPath.<List<Integer>>read(corrected, sheetOf(camlica) + ".day.counts.present")).containsExactly(1);
    }

    /** Tamamlanan şantiye bugünün listesine gelmez ama yoklaması alınmış geçmiş gününde gelir (sayı ile liste tutsun). */
    @Test
    void aFinishedSiteStillShowsOnADayItWasTaken() {
        Cookie owner = loginAsOwner();
        String finished = createSite(owner, "Biten " + UUID.randomUUID());
        String ali = addWorker(owner, finished, "Ali Usta");
        LocalDate lastWeek = TODAY.minusDays(7);
        assertThat(putJson("/api/attendance/days/" + lastWeek, owner,
            "{\"sites\": [%s]}".formatted(site(finished, ali, "PRESENT", null)))).hasStatusOk();
        assertThat(putJson("/api/sites/" + finished, owner, "{\"name\": \"Biten\", \"status\": \"COMPLETED\"}"))
            .hasStatusOk();

        String past = contentOf(get("/api/attendance/days/" + lastWeek, owner));
        assertThat(JsonPath.<List<Integer>>read(past, sheetOf(finished) + ".day.counts.present")).containsExactly(1);
        assertThat(JsonPath.<List<Object>>read(contentOf(get(TODAY_URI, owner)), sheetOf(finished))).isEmpty();
    }

    /** Hepsi ya da hiçbiri: ikinci şantiyenin listesi hatalıysa birincininki de yazılmaz. */
    @Test
    void oneInvalidSiteSavesNothing() {
        Cookie owner = loginAsOwner();
        String camlica = createSite(owner, "Günlük Çamlıca " + UUID.randomUUID());
        String avrupa = createSite(owner, "Günlük Avrupa " + UUID.randomUUID());
        String ali = addWorker(owner, camlica, "Ali Usta");
        String veli = addWorker(owner, avrupa, "Veli Kaya");

        String invalid = "{\"sites\": [%s, %s]}".formatted(site(camlica, ali, "PRESENT", null),
            site(avrupa, veli, "ABSENT", null));
        assertThat(putJson(TODAY_URI, owner, invalid))
            .hasStatus(400).bodyJson().extractingPath("$.detail").isEqualTo("Gelmeyen kişinin nedenini seç.");
        assertThat(contentOf(get("/api/sites/" + camlica + "/attendance/" + TODAY, owner))).contains("\"recordedAt\":null");

        String unknown = "{\"sites\": [%s]}".formatted(site(UUID.randomUUID().toString(), ali, "PRESENT", null));
        assertThat(putJson(TODAY_URI, owner, unknown)).hasStatus(404);
        String future = "/api/attendance/days/" + TODAY.plusDays(1);
        assertThat(putJson(future, owner, "{\"sites\": [%s]}".formatted(site(camlica, ali, "PRESENT", null))))
            .hasStatus(400);
    }
}
