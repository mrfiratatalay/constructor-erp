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
        Cookie lead = signedInLead(owner, "Personel Şefi");

        assertThat(postJson(workersOf(siteId), owner, "{\"fullName\": \"VELİ KAYA\", \"trade\": \"Kalıpçı\"}"))
            .hasStatus(201).bodyJson().extractingPath("$.fullName").isEqualTo("Veli Kaya");
        assertThat(postJson(workersOf(siteId), lead, "{\"fullName\": \"ali usta\", \"trade\": \"  \"}"))
            .hasStatus(201).bodyJson().extractingPath("$.trade").isNull();

        String listed = contentOf(get(workersOf(siteId), lead));
        assertThat(JsonPath.<List<String>>read(listed, "$[*].fullName")).containsExactly("Ali Usta", "Veli Kaya");
    }

    /** Firmadaki herkes her şantiyeyi görür (SiteAccess); bulunmayan ya da başka firmanın şantiyesi 404'tür. */
    @Test
    void anUnknownSiteHasNoWorkerList() {
        Cookie lead = signedInLead(loginAsOwner(), "Şef");
        String unknown = UUID.randomUUID().toString();

        assertThat(get(workersOf(unknown), lead)).hasStatus(404);
        assertThat(postJson(workersOf(unknown), lead, "{\"fullName\": \"Gizli Usta\"}")).hasStatus(404);
    }

    @Test
    void aWorkerNeedsAName() {
        Cookie owner = loginAsOwner();
        String siteId = createSite(owner, "Adsız " + UUID.randomUUID());

        assertThat(postJson(workersOf(siteId), owner, "{\"fullName\": \"   \"}")).hasStatus(400);
    }
}
