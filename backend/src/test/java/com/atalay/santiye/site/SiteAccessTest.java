package com.atalay.santiye.site;

import static org.assertj.core.api.Assertions.assertThat;

import com.atalay.santiye.support.ApiTestSupport;
import com.atalay.santiye.support.IntegrationTest;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.Test;

@IntegrationTest
class SiteAccessTest extends ApiTestSupport {

    @Test
    void siteLeadSeesOnlyTheSitesAssignedToThem() {
        Cookie owner = loginAsOwner();
        String assigned = createSite(owner, "Çamlıca Konutları");
        String other = createSite(owner, "Kartal B Blok");
        Cookie lead = signedInSiteLead(owner, "Ahmet Usta", assigned);

        String visible = contentOf(get("/api/sites", lead));

        assertThat(visible).contains("Çamlıca Konutları").doesNotContain("Kartal B Blok");
        assertThat(get("/api/sites/" + other, lead)).hasStatus(404);
        assertThat(get("/api/sites/" + assigned, lead)).bodyJson()
            .extractingPath("$.leads[0].fullName").isEqualTo("Ahmet Usta");
    }

    @Test
    void onlyTheOwnerCreatesAndEditsSites() {
        Cookie owner = loginAsOwner();
        String siteId = createSite(owner, "Beylikdüzü Villaları");
        Cookie lead = signedInSiteLead(owner, "Serkan Kalfa", siteId);
        String edit = "{\"name\": \"Beylikdüzü Villaları\", \"status\": \"COMPLETED\"}";

        assertThat(postJson("/api/sites", lead, "{\"name\": \"Yetkisiz\"}")).hasStatus(403);
        assertThat(mvc.put().uri("/api/sites/" + siteId).cookie(lead)
            .contentType("application/json").content(edit)).hasStatus(403);
        assertThat(mvc.put().uri("/api/sites/" + siteId).cookie(owner)
            .contentType("application/json").content(edit)).bodyJson()
            .extractingPath("$.status").isEqualTo("COMPLETED");
    }

    @Test
    void assigningAnUnknownSiteIsRejected() {
        Cookie owner = loginAsOwner();
        String json = "{\"fullName\": \"Murat\", \"phone\": \"%s\", \"role\": \"SITE_LEAD\", \"siteIds\": [\"%s\"]}"
            .formatted(uniquePhone(), java.util.UUID.randomUUID());

        assertThat(postJson("/api/team/members", owner, json)).hasStatus(400).bodyJson()
            .extractingPath("$.detail").isEqualTo("Seçilen şantiyelerden biri bulunamadı.");
    }
}
