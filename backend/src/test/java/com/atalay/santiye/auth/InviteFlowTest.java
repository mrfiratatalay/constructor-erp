package com.atalay.santiye.auth;

import static org.assertj.core.api.Assertions.assertThat;

import com.atalay.santiye.support.ApiTestSupport;
import com.atalay.santiye.support.IntegrationTest;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.Test;

@IntegrationTest
class InviteFlowTest extends ApiTestSupport {

    @Test
    void inviteLinkSignsTheMemberInExactlyOnce() {
        String created = createMember(loginAsOwner(), "Ahmet Usta", "SITE_LEAD");
        String inviteUrl = read(created, "$.invite.url");

        Cookie member = sessionCookieOf(acceptInvite(inviteUrl));

        assertThat(get("/api/auth/me", member)).bodyJson().extractingPath("$.role").isEqualTo("SITE_LEAD");
        assertThat(acceptInvite(inviteUrl)).hasStatus(400);
    }

    @Test
    void aNewLinkInvalidatesTheUnusedOldOne() {
        Cookie owner = loginAsOwner();
        String created = createMember(owner, "Serkan Kalfa", "SITE_LEAD");
        String oldUrl = read(created, "$.invite.url");
        String memberId = read(created, "$.member.id");

        String newLink = contentOf(postJson("/api/team/members/" + memberId + "/login-link", owner, ""));

        assertThat(acceptInvite(oldUrl)).hasStatus(400);
        assertThat(acceptInvite(read(newLink, "$.url"))).hasStatusOk();
    }

    @Test
    void deactivatedMemberIsSignedOutOnEveryDevice() {
        Cookie owner = loginAsOwner();
        String created = createMember(owner, "Murat Formen", "SITE_LEAD");
        Cookie member = sessionCookieOf(acceptInvite(read(created, "$.invite.url")));

        String body = "{\"fullName\": \"Murat Formen\", \"role\": \"SITE_LEAD\", \"active\": false, \"siteIds\": []}";
        assertThat(patchJson("/api/team/members/" + read(created, "$.member.id"), owner, body)).hasStatusOk();

        assertThat(get("/api/auth/me", member)).hasStatus(401);
    }
}
