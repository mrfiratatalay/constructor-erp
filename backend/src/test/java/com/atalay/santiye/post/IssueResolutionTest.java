package com.atalay.santiye.post;

import static org.assertj.core.api.Assertions.assertThat;

import com.atalay.santiye.support.ApiTestSupport;
import com.atalay.santiye.support.IntegrationTest;
import jakarta.servlet.http.Cookie;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.assertj.MvcTestResult;

/** Sahadan gelen sorunu patron ya da şef çözer; çalışan bildirir ama kapatamaz. */
@IntegrationTest
class IssueResolutionTest extends ApiTestSupport {

    @Test
    void onlyTheOwnerOrASiteLeadResolvesAnIssue() {
        Cookie owner = loginAsOwner();
        String site = createSite(owner, "Sorun Şantiyesi " + UUID.randomUUID());
        Cookie worker = sessionCookieOf(join(joinToken(owner), null, "Saha Çalışanı", uniquePhone()));
        Cookie lead = signedInLead(owner, "Sorunu Çözen Şef");
        String issue = reportIssue(worker, site);

        assertThat(postJson("/api/posts/" + issue + "/resolve", worker, "{}")).hasStatus(403);
        assertThat(postJson("/api/posts/" + issue + "/resolve", lead, "{\"note\": \"Demir geldi\"}")).hasStatusOk();
    }

    private String reportIssue(Cookie session, String siteId) {
        String id = UUID.randomUUID().toString();
        MvcTestResult sent = mvc.post().uri("/api/posts").multipart().cookie(session)
            .param("id", id).param("siteId", siteId).param("issue", "true").param("body", "Demir gelmedi")
            .exchange();
        assertThat(sent).hasStatus(201);
        return id;
    }
}
