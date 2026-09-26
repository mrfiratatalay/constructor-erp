package com.atalay.santiye.join;

import static org.assertj.core.api.Assertions.assertThat;

import com.atalay.santiye.support.ApiTestSupport;
import com.atalay.santiye.support.IntegrationTest;
import jakarta.servlet.http.Cookie;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.assertj.MvcTestResult;

@IntegrationTest
class CompanyJoinFlowTest extends ApiTestSupport {

    @Test
    void newcomerJoinsWithTheirOwnNameAndSeesEverySite() {
        Cookie owner = loginAsOwner();
        String first = createSite(owner, "Birinci " + UUID.randomUUID());
        String second = createSite(owner, "İkinci " + UUID.randomUUID());
        String token = joinToken(owner);

        assertThat(get("/api/join/" + token, null)).bodyJson().extractingPath("$.alreadyInside").isEqualTo(false);
        Cookie newcomer = sessionCookieOf(join(token, null, "yeni USTA", uniquePhone()));

        assertThat(get("/api/sites/" + first, newcomer)).hasStatusOk();
        assertThat(get("/api/sites/" + second, newcomer)).hasStatusOk();
        assertThat(get("/api/auth/me", newcomer)).bodyJson().extractingPath("$.fullName").isEqualTo("Yeni Usta");
    }

    @Test
    void theSameLinkWorksForEveryone() {
        String token = joinToken(loginAsOwner());

        assertThat(join(token, null, "Birinci Usta", uniquePhone())).hasStatusOk();
        assertThat(join(token, null, "İkinci Usta", uniquePhone())).hasStatusOk();
    }

    @Test
    void someoneAlreadyInsideIsNotSignedUpAgain() {
        Cookie owner = loginAsOwner();
        Cookie lead = signedInLead(owner, "Oturumu Açık Şef");

        MvcTestResult again = join(joinToken(owner), lead, "", "");

        assertThat(again).hasStatusOk();
        assertThat(again.getResponse().getCookie(SESSION_COOKIE)).isNull();
    }

    @Test
    void resettingTheLinkStopsTheOldOne() {
        Cookie owner = loginAsOwner();
        String old = joinToken(owner);

        assertThat(postJson("/api/company/join-link/reset", owner, "")).hasStatusOk();

        assertThat(join(old, null, "Geç Kalan", uniquePhone())).hasStatus(400);
        assertThat(join(joinToken(owner), null, "Yeni Bağlantılı", uniquePhone())).hasStatusOk();
    }

    @Test
    void everyoneSharesTheLinkButOnlyTheOwnerResetsIt() {
        Cookie lead = signedInLead(loginAsOwner(), "Paylaşan Şef");

        assertThat(get("/api/company/join-link", lead)).hasStatusOk();
        assertThat(postJson("/api/company/join-link/reset", lead, "")).hasStatus(403);
    }
}
