package com.atalay.santiye.team;

import static org.assertj.core.api.Assertions.assertThat;

import com.atalay.santiye.support.ApiTestSupport;
import com.atalay.santiye.support.IntegrationTest;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.Test;

@IntegrationTest
class TeamMembersTest extends ApiTestSupport {

    @Test
    void aNewcomerNeedsAPhoneNumber() {
        assertThat(join(joinToken(loginAsOwner()), null, "Numarasız Usta", "")).hasStatus(400);
    }

    @Test
    void theSameNumberCannotJoinTwice() {
        String token = joinToken(loginAsOwner());
        String phone = uniquePhone();
        assertThat(join(token, null, "Selim Usta", phone)).hasStatusOk();

        String sameNumberWrittenDifferently = "+90 " + phone.substring(1);
        assertThat(join(token, null, "Selim", sameNumberWrittenDifferently)).hasStatus(400).bodyJson()
            .extractingPath("$.detail").isEqualTo("Bu numara zaten kayıtlı. Patronundan giriş linki iste.");
    }

    @Test
    void removedPersonComesBackWithTheSameNumber() {
        Cookie owner = loginAsOwner();
        String token = joinToken(owner);
        String phone = uniquePhone();
        String memberId = userIdOf(sessionCookieOf(join(token, null, "Oğuz Kalfa", phone)));

        String removal = "{\"fullName\": \"Oğuz Kalfa\", \"phone\": \"%s\", \"role\": \"SITE_LEAD\", \"active\": false}"
            .formatted(phone);
        assertThat(patchJson("/api/team/members/" + memberId, owner, removal)).hasStatusOk();

        assertThat(userIdOf(sessionCookieOf(join(token, null, "Oğuz Kalfa", phone)))).isEqualTo(memberId);
    }

    @Test
    void namesAreWrittenTheTurkishWay() {
        Cookie member = sessionCookieOf(join(joinToken(loginAsOwner()), null, "İLKER IŞIK", uniquePhone()));

        assertThat(get("/api/auth/me", member)).bodyJson().extractingPath("$.fullName").isEqualTo("İlker Işık");
    }
}
