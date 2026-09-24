package com.atalay.santiye.team;

import static org.assertj.core.api.Assertions.assertThat;

import com.atalay.santiye.support.ApiTestSupport;
import com.atalay.santiye.support.IntegrationTest;
import jakarta.servlet.http.Cookie;
import org.springframework.test.web.servlet.assertj.MvcTestResult;
import org.junit.jupiter.api.Test;

@IntegrationTest
class TeamMembersTest extends ApiTestSupport {

    @Test
    void aMemberNeedsAPhoneNumber() {
        String json = "{\"fullName\": \"Numarasız Usta\", \"role\": \"SITE_LEAD\", \"siteIds\": []}";

        assertThat(postJson("/api/team/members", loginAsOwner(), json)).hasStatus(400);
    }

    @Test
    void theSameNumberIsNotAddedTwice() {
        Cookie owner = loginAsOwner();
        String phone = uniquePhone();
        assertThat(postJson("/api/team/members", owner, memberJson("Selim Usta", phone))).hasStatus(201);

        String sameNumberWrittenDifferently = "+90 " + phone.substring(1);
        assertThat(postJson("/api/team/members", owner, memberJson("Selim", sameNumberWrittenDifferently)))
            .hasStatus(400).bodyJson().extractingPath("$.detail").isEqualTo("Bu numara zaten ekipte: Selim Usta.");
    }

    @Test
    void removedMemberLeavesEverySiteAndComesBackWithTheSameNumber() {
        Cookie owner = loginAsOwner();
        String siteId = createSite(owner, "Ekipten Çıkma Şantiyesi");
        String phone = uniquePhone();
        String created = contentOf(postJson("/api/team/members", owner, memberJson("Oğuz Kalfa", phone, siteId)));
        String memberId = read(created, "$.member.id");

        String removal = "{\"fullName\": \"Oğuz Kalfa\", \"phone\": \"%s\", \"role\": \"SITE_LEAD\", "
            .formatted(phone) + "\"active\": false, \"siteIds\": [\"%s\"]}".formatted(siteId);
        assertThat(patchJson("/api/team/members/" + memberId, owner, removal)).bodyJson()
            .extractingPath("$.siteIds").asArray().isEmpty();

        MvcTestResult again = postJson("/api/team/members", owner, memberJson("Oğuz Kalfa", phone));
        assertThat(again).hasStatus(201);
        assertThat(read(contentOf(again), "$.member.id")).isEqualTo(memberId);
    }

    @Test
    void namesAreWrittenTheTurkishWay() {
        String json = memberJson("İLKER IŞIK", uniquePhone());

        assertThat(postJson("/api/team/members", loginAsOwner(), json)).bodyJson()
            .extractingPath("$.member.fullName").isEqualTo("İlker Işık");
    }

    private static String memberJson(String fullName, String phone, String... siteIds) {
        return "{\"fullName\": \"%s\", \"phone\": \"%s\", \"role\": \"SITE_LEAD\", \"siteIds\": %s}"
            .formatted(fullName, phone, jsonArray(siteIds));
    }
}
