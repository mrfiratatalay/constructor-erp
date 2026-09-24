package com.atalay.santiye.auth;

import static org.assertj.core.api.Assertions.assertThat;

import com.atalay.santiye.support.ApiTestSupport;
import com.atalay.santiye.support.IntegrationTest;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.Test;

/** Giriş linki: telefonunu değiştiren ya da "giremiyorum" diyen kişiye patronun gönderdiği tek kullanımlık link. */
@IntegrationTest
class InviteFlowTest extends ApiTestSupport {

    @Test
    void loginLinkSignsTheMemberInExactlyOnce() {
        Cookie owner = loginAsOwner();
        String memberId = userIdOf(signedInLead(owner, "Ahmet Usta"));
        String loginUrl = loginLinkFor(owner, memberId);

        Cookie otherPhone = sessionCookieOf(acceptInvite(loginUrl));

        assertThat(get("/api/auth/me", otherPhone)).bodyJson().extractingPath("$.role").isEqualTo("SITE_LEAD");
        assertThat(acceptInvite(loginUrl)).hasStatus(400);
    }

    @Test
    void aNewLinkInvalidatesTheUnusedOldOne() {
        Cookie owner = loginAsOwner();
        String memberId = userIdOf(signedInLead(owner, "Serkan Kalfa"));
        String oldUrl = loginLinkFor(owner, memberId);

        String newUrl = loginLinkFor(owner, memberId);

        assertThat(acceptInvite(oldUrl)).hasStatus(400);
        assertThat(acceptInvite(newUrl)).hasStatusOk();
    }

    @Test
    void removedMemberIsSignedOutOnEveryDevice() {
        Cookie owner = loginAsOwner();
        Cookie member = signedInLead(owner, "Murat Formen");

        String body = "{\"fullName\": \"Murat Formen\", \"role\": \"SITE_LEAD\", \"active\": false}";
        assertThat(patchJson("/api/team/members/" + userIdOf(member), owner, body)).hasStatusOk();

        assertThat(get("/api/auth/me", member)).hasStatus(401);
    }

    private String loginLinkFor(Cookie owner, String memberId) {
        return read(contentOf(postJson("/api/team/members/" + memberId + "/login-link", owner, "")), "$.url");
    }
}
