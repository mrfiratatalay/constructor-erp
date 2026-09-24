package com.atalay.santiye.team;

import static org.assertj.core.api.Assertions.assertThat;

import com.atalay.santiye.support.ApiTestSupport;
import com.atalay.santiye.support.IntegrationTest;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.Test;

@IntegrationTest
class TeamAccessTest extends ApiTestSupport {

    @Test
    void siteLeadCannotManagePeople() {
        Cookie member = signedInLead(loginAsOwner(), "Kemal Usta");
        String body = "{\"fullName\": \"Kemal Usta\", \"role\": \"OWNER\", \"active\": true}";

        assertThat(patchJson("/api/team/members/" + userIdOf(member), member, body)).hasStatus(403);
    }

    @Test
    void ownerCannotLockThemselvesOut() {
        Cookie owner = loginAsOwner();
        String body = "{\"fullName\": \"Patron\", \"role\": \"OWNER\", \"active\": false}";

        assertThat(patchJson("/api/team/members/" + userIdOf(owner), owner, body)).hasStatus(400);
    }
}
