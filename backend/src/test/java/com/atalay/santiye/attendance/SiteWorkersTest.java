package com.atalay.santiye.attendance;

import static org.assertj.core.api.Assertions.assertThat;

import com.atalay.santiye.support.ApiTestSupport;
import com.atalay.santiye.support.IntegrationTest;
import com.jayway.jsonpath.JsonPath;
import jakarta.servlet.http.Cookie;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;

@IntegrationTest
class SiteWorkersTest extends ApiTestSupport {

    private String workersOf(String siteId) {
        return "/api/sites/" + siteId + "/workers";
    }

    @Test
    void theOwnerAndTheSiteLeadAddWorkersWhoAreListedByName() {
        Cookie owner = loginAsOwner();
        String siteId = createSite(owner, "Personel " + UUID.randomUUID());
        Cookie lead = signedInSiteLead(owner, "Personel Şefi", siteId);

        assertThat(postJson(workersOf(siteId), owner, "{\"fullName\": \"VELİ KAYA\", \"trade\": \"Kalıpçı\"}"))
            .hasStatus(201).bodyJson().extractingPath("$.fullName").isEqualTo("Veli Kaya");
        assertThat(postJson(workersOf(siteId), lead, "{\"fullName\": \"ali usta\", \"trade\": \"  \"}"))
            .hasStatus(201).bodyJson().extractingPath("$.trade").isNull();

        String listed = contentOf(get(workersOf(siteId), lead));
        assertThat(JsonPath.<List<String>>read(listed, "$[*].fullName")).containsExactly("Ali Usta", "Veli Kaya");
    }

    @Test
    void aSiteLeadCannotSeeOrAddWorkersOfAnotherSite() {
        Cookie owner = loginAsOwner();
        String ownSite = createSite(owner, "Kendi " + UUID.randomUUID());
        String otherSite = createSite(owner, "Başka " + UUID.randomUUID());
        Cookie lead = signedInSiteLead(owner, "Sınırlı Şef", ownSite);

        assertThat(get(workersOf(otherSite), lead)).hasStatus(404);
        assertThat(postJson(workersOf(otherSite), lead, "{\"fullName\": \"Gizli Usta\"}")).hasStatus(404);
    }

    @Test
    void aWorkerNeedsAName() {
        Cookie owner = loginAsOwner();
        String siteId = createSite(owner, "Adsız " + UUID.randomUUID());

        assertThat(postJson(workersOf(siteId), owner, "{\"fullName\": \"   \"}")).hasStatus(400);
    }
}
