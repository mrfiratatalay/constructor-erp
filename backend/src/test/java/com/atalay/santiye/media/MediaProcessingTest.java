package com.atalay.santiye.media;

import static org.assertj.core.api.Assertions.assertThat;
import static org.awaitility.Awaitility.await;

import com.atalay.santiye.support.ApiTestSupport;
import com.atalay.santiye.support.IntegrationTest;
import com.atalay.santiye.support.PostDraft;
import com.atalay.santiye.support.TestMedia;
import jakarta.servlet.http.Cookie;
import java.time.Duration;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpHeaders;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.assertj.MvcTestResult;

@IntegrationTest
class MediaProcessingTest extends ApiTestSupport {

    private Cookie lead;
    private String siteId;

    @BeforeEach
    void siteWithLead() {
        Cookie owner = loginAsOwner();
        siteId = createSite(owner, "Medya Şantiyesi " + UUID.randomUUID());
        lead = signedInSiteLead(owner, "Medya Usta", siteId);
    }

    @Test
    void photoIsConvertedAndServedWithAThumbnail() {
        String post = postAndWaitUntilReady(TestMedia.photo());

        assertThat(get(read(post, "$.media[0].url"), lead)).hasStatusOk().hasContentType("image/jpeg");
        assertThat(get(read(post, "$.media[0].thumbnailUrl"), lead)).hasStatusOk().hasContentType("image/jpeg");
    }

    @Test
    void iphoneVideoBecomesMp4ThatSafariCanSeek() {
        String post = postAndWaitUntilReady(TestMedia.portraitVideo());
        String url = read(post, "$.media[0].url");

        MvcTestResult partial = mvc.get().uri(url).cookie(lead).header(HttpHeaders.RANGE, "bytes=0-99").exchange();

        assertThat(partial).hasStatus(206).hasContentType("video/mp4");
        assertThat(partial.getResponse().getContentAsByteArray()).hasSize(100);
        assertThat((Double) com.jayway.jsonpath.JsonPath.read(post, "$.media[0].durationSeconds")).isBetween(1.5, 2.5);
    }

    @Test
    void androidVoiceNoteBecomesAudioThatIphoneCanPlay() {
        String post = postAndWaitUntilReady(TestMedia.chromeVoiceNote());

        assertThat(get(read(post, "$.media[0].url"), lead)).hasStatusOk().hasContentType("audio/mp4");
        assertThat(post).doesNotContain("\"thumbnailUrl\":\"/api");
    }

    private String postAndWaitUntilReady(MockMultipartFile file) {
        PostDraft draft = PostDraft.to(siteId, null);
        assertThat(sendPost(lead, draft, file)).hasStatus(201);
        String postUrl = "/api/posts/" + draft.id();
        await().atMost(Duration.ofSeconds(60)).pollInterval(Duration.ofMillis(250))
            .until(() -> read(contentOf(get(postUrl, lead)), "$.media[0].status").equals("READY"));
        return contentOf(get(postUrl, lead));
    }
}
