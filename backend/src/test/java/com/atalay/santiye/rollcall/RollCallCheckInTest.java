package com.atalay.santiye.rollcall;

import static org.assertj.core.api.Assertions.assertThat;

import com.atalay.santiye.support.ApiTestSupport;
import com.atalay.santiye.support.IntegrationTest;
import com.atalay.santiye.support.PostDraft;
import com.jayway.jsonpath.JsonPath;
import jakarta.servlet.http.Cookie;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.assertj.MvcTestResult;

@IntegrationTest
class RollCallCheckInTest extends ApiTestSupport {

    @Autowired
    private JdbcTemplate jdbc;

    private String openRollCall(Cookie session, String siteId) {
        return read(contentOf(postJson("/api/sites/" + siteId + "/roll-calls", session, "{}")), "$.id");
    }

    private MvcTestResult checkIn(Cookie session, String postId) {
        return postJson("/api/roll-calls/" + postId + "/check-in", session, "{}");
    }

    @Test
    void aWorkerJoinsFromTheirOwnPhoneAndCountsAsPresent() {
        Cookie owner = loginAsOwner();
        String siteName = "Katılım " + UUID.randomUUID();
        String siteId = createSite(owner, siteName);
        Cookie lead = signedInLead(owner, "Sabah Şefi");
        Cookie worker = signedInLead(owner, "Kalıpçı Ali");
        String postId = openRollCall(lead, siteId);

        String mine = contentOf(checkIn(worker, postId));

        assertThat(read(mine, "$.mine.status")).isEqualTo("PRESENT");
        assertThat(read(mine, "$.mine.siteName")).isEqualTo(siteName);
        assertThat((Integer) JsonPath.read(mine, "$.joinedCount")).isEqualTo(1);
        String leadsView = contentOf(get("/api/roll-calls/" + postId, lead));
        assertThat((Integer) JsonPath.read(leadsView, "$.joinedCount")).isEqualTo(1);
        assertThat((Object) JsonPath.read(leadsView, "$.mine")).isNull();
    }

    @Test
    void joiningAgainKeepsTheFirstSiteAndTime() {
        Cookie owner = loginAsOwner();
        String firstSite = createSite(owner, "İlk " + UUID.randomUUID());
        String secondSite = createSite(owner, "İkinci " + UUID.randomUUID());
        Cookie worker = signedInLead(owner, "Gezgin Usta");
        String first = contentOf(checkIn(worker, openRollCall(owner, firstSite)));

        String second = contentOf(checkIn(worker, openRollCall(owner, secondSite)));

        assertThat(read(second, "$.mine.checkedInAt")).isEqualTo(read(first, "$.mine.checkedInAt"));
        assertThat(read(second, "$.mine.siteName")).isEqualTo(read(first, "$.mine.siteName"));
        assertThat((Integer) JsonPath.read(second, "$.joinedCount")).isZero();
    }

    @Test
    void theOwnerIsNotInTheRoll() {
        Cookie owner = loginAsOwner();
        String postId = openRollCall(owner, createSite(owner, "Patron " + UUID.randomUUID()));

        assertThat(checkIn(owner, postId)).hasStatus(403);
        assertThat(get("/api/roll-calls/" + postId, owner)).bodyJson().extractingPath("$.mine").isNull();
    }

    @Test
    void yesterdaysRollCallIsClosed() {
        Cookie owner = loginAsOwner();
        Cookie worker = signedInLead(owner, "Geç Kalan");
        String postId = openRollCall(owner, createSite(owner, "Dün " + UUID.randomUUID()));
        jdbc.update("update posts set roll_call_day = roll_call_day - 1 where id = ?", UUID.fromString(postId));

        assertThat(get("/api/roll-calls/" + postId, worker)).bodyJson().extractingPath("$.open").isEqualTo(false);
        assertThat(checkIn(worker, postId)).hasStatus(409).bodyJson().extractingPath("$.detail")
            .isEqualTo("Bu yoklama kapandı: yalnızca bugünün yoklamasına katılınır.");
    }

    @Test
    void anOrdinaryMessageIsNotARollCall() {
        Cookie owner = loginAsOwner();
        String siteId = createSite(owner, "Düz " + UUID.randomUUID());
        PostDraft draft = PostDraft.to(siteId, "Beton geldi");
        sendPost(owner, draft);

        assertThat(get("/api/roll-calls/" + draft.id(), owner)).hasStatus(404);
    }
}
