package com.atalay.santiye.join;

import static org.assertj.core.api.Assertions.assertThat;

import com.atalay.santiye.support.ApiTestSupport;
import com.atalay.santiye.support.IntegrationTest;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.assertj.MvcTestResult;

@IntegrationTest
class SiteInviteFlowTest extends ApiTestSupport {

    @Test
    void newcomerJoinsWithTheirOwnNameAndSeesOnlyThatSite() {
        Cookie owner = loginAsOwner();
        String siteId = createSite(owner, "Davetli Şantiye");
        createSite(owner, "Başka Şantiye");
        String token = inviteTokenFor(owner, siteId);

        assertThat(get("/api/site-invites/" + token, null)).bodyJson()
            .extractingPath("$.siteName").isEqualTo("Davetli Şantiye");
        Cookie newcomer = sessionCookieOf(join(token, null, "{\"fullName\": \"yeni USTA\", \"phone\": \"%s\"}"
            .formatted(uniquePhone())));

        assertThat(get("/api/sites", newcomer)).bodyJson().extractingPath("$[*].name").asArray()
            .containsExactly("Davetli Şantiye");
        assertThat(get("/api/auth/me", newcomer)).bodyJson().extractingPath("$.fullName").isEqualTo("Yeni Usta");
    }

    @Test
    void aLinkWorksForOnePersonOnly() {
        Cookie owner = loginAsOwner();
        String token = inviteTokenFor(owner, createSite(owner, "Tek Kişilik"));
        assertThat(join(token, null, newcomerJson("Birinci Usta"))).hasStatusOk();

        assertThat(join(token, null, newcomerJson("İkinci Usta"))).hasStatus(400);
    }

    @Test
    void nobodyCanTakeOverAnExistingNumber() {
        Cookie owner = loginAsOwner();
        String phone = uniquePhone();
        String token = inviteTokenFor(owner, createSite(owner, "Numara Korumalı"));
        assertThat(join(token, null, "{\"fullName\": \"Asıl Kişi\", \"phone\": \"%s\"}".formatted(phone))).hasStatusOk();

        String second = inviteTokenFor(owner, createSite(owner, "İkinci Şantiye"));
        assertThat(join(second, null, "{\"fullName\": \"Sahte\", \"phone\": \"%s\"}".formatted(phone))).hasStatus(400);
    }

    @Test
    void signedInLeadJoinsAnotherSiteWithOneTap() {
        Cookie owner = loginAsOwner();
        Cookie lead = signedInSiteLead(owner, "Oturumu Açık Şef", createSite(owner, "İlk Şantiye"));
        String token = inviteTokenFor(owner, createSite(owner, "Yeni Katılınan"));

        MvcTestResult joined = join(token, lead, "{}");

        assertThat(joined).hasStatusOk();
        assertThat(joined.getResponse().getCookie(SESSION_COOKIE)).isNull();
        assertThat(get("/api/sites", lead)).bodyJson().extractingPath("$[*].name").asArray()
            .contains("İlk Şantiye", "Yeni Katılınan");
    }

    @Test
    void onlyTheOwnerCreatesLinks() {
        Cookie owner = loginAsOwner();
        String siteId = createSite(owner, "Yetki Şantiyesi");
        Cookie lead = signedInSiteLead(owner, "Yetkisiz Şef", siteId);

        assertThat(postJson("/api/sites/" + siteId + "/invites", lead, "")).hasStatus(403);
    }

    private String inviteTokenFor(Cookie owner, String siteId) {
        MvcTestResult created = postJson("/api/sites/" + siteId + "/invites", owner, "");
        assertThat(created).hasStatus(201);
        String url = read(contentOf(created), "$.url");
        return url.substring(url.lastIndexOf('/') + 1);
    }

    private MvcTestResult join(String token, Cookie session, String json) {
        return postJson("/api/site-invites/" + token + "/accept", session, json);
    }

    private static String newcomerJson(String fullName) {
        return "{\"fullName\": \"%s\", \"phone\": \"%s\"}".formatted(fullName, uniquePhone());
    }
}
