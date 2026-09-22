package com.atalay.santiye.team;

import static org.assertj.core.api.Assertions.assertThat;

import com.atalay.santiye.support.ApiTestSupport;
import com.atalay.santiye.support.IntegrationTest;
import com.jayway.jsonpath.JsonPath;
import jakarta.servlet.http.Cookie;
import java.util.List;
import org.junit.jupiter.api.Test;

@IntegrationTest
class TeamAccessTest extends ApiTestSupport {

    @Test
    void siteLeadCannotManageTheTeam() {
        String created = createMember(loginAsOwner(), "Kemal Usta", "SITE_LEAD");
        Cookie member = sessionCookieOf(acceptInvite(read(created, "$.invite.url")));

        assertThat(get("/api/team/members", member)).hasStatus(403);
    }

    @Test
    void ownerCannotLockThemselvesOut() {
        Cookie owner = loginAsOwner();
        String me = contentOf(get("/api/auth/me", owner));

        String body = "{\"fullName\": \"Patron\", \"role\": \"OWNER\", \"active\": false, \"siteIds\": []}";

        assertThat(patchJson("/api/team/members/" + read(me, "$.id"), owner, body)).hasStatus(400);
    }

    @Test
    void memberListShowsWhoHasOpenedTheirLink() {
        Cookie owner = loginAsOwner();
        String created = createMember(owner, "Hasan Kalfa", "SITE_LEAD");
        String memberId = read(created, "$.member.id");
        assertThat(lastSeenOf(owner, memberId)).isNull();

        acceptInvite(read(created, "$.invite.url"));

        assertThat(lastSeenOf(owner, memberId)).isNotNull();
    }

    private Object lastSeenOf(Cookie owner, String memberId) {
        String list = contentOf(get("/api/team/members", owner));
        List<Object> matches = JsonPath.read(list, "$[?(@.id == '" + memberId + "')].lastSeenAt");
        return matches.getFirst();
    }
}
