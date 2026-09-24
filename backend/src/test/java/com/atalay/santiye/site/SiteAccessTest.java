package com.atalay.santiye.site;

import static org.assertj.core.api.Assertions.assertThat;

import com.atalay.santiye.support.ApiTestSupport;
import com.atalay.santiye.support.IntegrationTest;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.Test;

@IntegrationTest
class SiteAccessTest extends ApiTestSupport {

    @Test
    void everyoneSeesEverySiteAndEveryoneIsInIt() {
        Cookie owner = loginAsOwner();
        String first = createSite(owner, "Çamlıca Konutları");
        String second = createSite(owner, "Kartal B Blok");
        Cookie lead = signedInLead(owner, "Ahmet Usta");

        assertThat(contentOf(get("/api/sites", lead))).contains("Çamlıca Konutları", "Kartal B Blok");
        assertThat(get("/api/sites/" + first, lead)).bodyJson()
            .extractingPath("$.leads[*].fullName").asArray().contains("Ahmet Usta");
        assertThat(get("/api/sites/" + second, lead)).bodyJson()
            .extractingPath("$.owners[*].fullName").asArray().contains("Patron");
    }

    @Test
    void onlyTheOwnerCreatesAndEditsSites() {
        Cookie owner = loginAsOwner();
        String siteId = createSite(owner, "Beylikdüzü Villaları");
        Cookie lead = signedInLead(owner, "Serkan Kalfa");
        String edit = "{\"name\": \"Beylikdüzü Villaları\", \"status\": \"COMPLETED\"}";

        assertThat(postJson("/api/sites", lead, "{\"name\": \"Yetkisiz\"}")).hasStatus(403);
        assertThat(mvc.put().uri("/api/sites/" + siteId).cookie(lead)
            .contentType("application/json").content(edit)).hasStatus(403);
        assertThat(mvc.put().uri("/api/sites/" + siteId).cookie(owner)
            .contentType("application/json").content(edit)).bodyJson()
            .extractingPath("$.status").isEqualTo("COMPLETED");
    }
}
