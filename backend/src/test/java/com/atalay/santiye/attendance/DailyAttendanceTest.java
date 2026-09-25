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
}
