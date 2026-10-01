package com.atalay.santiye.team;

import static org.assertj.core.api.Assertions.assertThat;

import com.atalay.santiye.support.ApiTestSupport;
import com.atalay.santiye.support.IntegrationTest;
import com.atalay.santiye.support.PostDraft;
import jakarta.servlet.http.Cookie;
import java.util.UUID;
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

    /**
     * Numara doğrulanmaz: çıkarılan birinin numarasıyla gelen (kendisi de olsa, numarayı bilen başkası da olsa) yeni bir
     * hesapla girer. Eski hesabın mesajlarına dokunamaz; onlar yazanın adıyla yerinde kalır.
     */
    @Test
    void removedPersonComesBackAsANewAccountThatCannotTouchTheOldOne() {
        Cookie owner = loginAsOwner();
        String token = joinToken(owner);
        String phone = uniquePhone();
        Cookie first = sessionCookieOf(join(token, null, "Oğuz Kalfa", phone));
        String memberId = userIdOf(first);
        String site = createSite(owner, "Geri Dönüş Şantiyesi " + UUID.randomUUID());
        PostDraft old = PostDraft.to(site, "Kalıp söküldü");
        assertThat(sendPost(first, old)).hasStatus(201);

        String removal = "{\"fullName\": \"Oğuz Kalfa\", \"phone\": \"%s\", \"role\": \"WORKER\", \"active\": false}"
            .formatted(phone);
        assertThat(patchJson("/api/team/members/" + memberId, owner, removal)).hasStatusOk();
        Cookie again = sessionCookieOf(join(token, null, "Oğuz Kalfa", phone));

        assertThat(userIdOf(again)).isNotEqualTo(memberId);
        assertThat(patchJson("/api/posts/" + old.id(), again, "{\"body\": \"Değiştirdim\", \"issue\": false}"))
            .hasStatus(403);
    }

    @Test
    void namesAreWrittenTheTurkishWay() {
        Cookie member = sessionCookieOf(join(joinToken(loginAsOwner()), null, "İLKER IŞIK", uniquePhone()));

        assertThat(get("/api/auth/me", member)).bodyJson().extractingPath("$.fullName").isEqualTo("İlker Işık");
    }
}
