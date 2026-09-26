package com.atalay.santiye.rollcall;

import static org.assertj.core.api.Assertions.assertThat;

import com.atalay.santiye.support.ApiTestSupport;
import com.atalay.santiye.support.IntegrationTest;
import com.jayway.jsonpath.JsonPath;
import jakarta.servlet.http.Cookie;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;

@IntegrationTest
class RollCallMessageTest extends ApiTestSupport {

    /** Uygulamanın "bugün"ü şantiyenin saatine göredir (app.timezone). */
    private static final LocalDate TODAY = LocalDate.now(ZoneId.of("Europe/Istanbul"));

    private String openRollCall(Cookie session, String siteId) {
        return contentOf(postJson("/api/sites/" + siteId + "/roll-calls", session, "{}"));
    }

    @Test
    void aLeadSendsTodaysRollCallIntoTheChat() {
        Cookie owner = loginAsOwner();
        String siteId = createSite(owner, "Yoklama mesajı " + UUID.randomUUID());
        Cookie lead = signedInLead(owner, "Sabah Şefi");

        String post = openRollCall(lead, siteId);

        assertThat(read(post, "$.rollCallDay")).isEqualTo(TODAY.toString());
        assertThat((Object) JsonPath.read(post, "$.body")).isNull();
        List<String> feed = JsonPath.read(contentOf(get("/api/posts?siteId=" + siteId, owner)), "$.items[*].id");
        assertThat(feed).contains(read(post, "$.id"));
    }

    @Test
    void aSiteHasOneRollCallADay() {
        Cookie owner = loginAsOwner();
        String siteId = createSite(owner, "Günde bir " + UUID.randomUUID());
        Cookie lead = signedInLead(owner, "Erkenci Şef");

        String first = read(openRollCall(lead, siteId), "$.id");

        assertThat(read(openRollCall(owner, siteId), "$.id")).isEqualTo(first);
    }

    @Test
    void aDeletedRollCallCanBeSentAgain() {
        Cookie owner = loginAsOwner();
        String siteId = createSite(owner, "Yeniden " + UUID.randomUUID());
        String first = read(openRollCall(owner, siteId), "$.id");
        delete("/api/posts/" + first, owner);

        assertThat(read(openRollCall(owner, siteId), "$.id")).isNotEqualTo(first);
    }

    @Test
    void aRollCallIsNotCorrectedForwardedOrAddedToTheField() {
        Cookie owner = loginAsOwner();
        String siteId = createSite(owner, "Kural " + UUID.randomUUID());
        String otherSiteId = createSite(owner, "Öbür " + UUID.randomUUID());
        String postUri = "/api/posts/" + read(openRollCall(owner, siteId), "$.id");

        assertThat(patchJson(postUri, owner, "{\"body\": \"Yoklama\", \"issue\": false}")).hasStatus(409);
        assertThat(postJson(postUri + "/forward", owner, "{\"siteId\": \"%s\"}".formatted(otherSiteId)))
            .hasStatus(409);
        assertThat(putJson(postUri + "/field", owner, "")).hasStatus(409);
    }
}
