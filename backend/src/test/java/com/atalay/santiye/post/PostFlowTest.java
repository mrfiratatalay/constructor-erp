package com.atalay.santiye.post;

import static org.assertj.core.api.Assertions.assertThat;

import com.atalay.santiye.support.ApiTestSupport;
import com.atalay.santiye.support.IntegrationTest;
import com.atalay.santiye.support.PostDraft;
import com.atalay.santiye.support.TestMedia;
import com.jayway.jsonpath.JsonPath;
import jakarta.servlet.http.Cookie;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;

@IntegrationTest
class PostFlowTest extends ApiTestSupport {

    @Test
    void retryingTheSameUploadDoesNotCreateADuplicate() {
        Cookie owner = loginAsOwner();
        String siteId = createSite(owner, "Tekrar Şantiyesi " + UUID.randomUUID());
        PostDraft draft = PostDraft.to(siteId, "Kolonlar döküldü");

        assertThat(sendPost(owner, draft, TestMedia.photo())).hasStatus(201);
        assertThat(sendPost(owner, draft, TestMedia.photo())).hasStatus(201);

        List<String> ids = JsonPath.read(contentOf(get("/api/posts?siteId=" + siteId, owner)), "$.items[*].id");
        assertThat(ids).containsExactly(draft.id());
    }

    @Test
    void siteLeadCannotPostToOrReadAnotherSite() {
        Cookie owner = loginAsOwner();
        String ownSite = createSite(owner, "Kendi " + UUID.randomUUID());
        String otherSite = createSite(owner, "Başka " + UUID.randomUUID());
        Cookie lead = signedInSiteLead(owner, "Sınırlı Usta", ownSite);
        PostDraft ownerNote = PostDraft.to(otherSite, "Patronun notu");
        sendPost(owner, ownerNote);

        assertThat(sendPost(lead, PostDraft.to(otherSite, "Yanlış yer"))).hasStatus(404);
        assertThat(get("/api/posts/" + ownerNote.id(), lead)).hasStatus(404);
        assertThat(contentOf(get("/api/posts", lead))).doesNotContain("Patronun notu");
    }

    @Test
    void anEmptyPostIsRejectedWithAClearMessage() {
        Cookie owner = loginAsOwner();
        String siteId = createSite(owner, "Boş " + UUID.randomUUID());

        assertThat(sendPost(owner, PostDraft.to(siteId, "   "))).hasStatus(400)
            .bodyJson().extractingPath("$.detail")
            .isEqualTo("Boş gönderi gönderilemez: fotoğraf, video, ses ya da yazı ekle.");
    }

    @Test
    void feedPagesFromNewestToOldestWithoutGapsOrRepeats() {
        Cookie owner = loginAsOwner();
        String siteId = createSite(owner, "Sayfa " + UUID.randomUUID());
        for (String note : List.of("birinci", "ikinci", "üçüncü")) {
            sendPost(owner, PostDraft.to(siteId, note));
        }

        String first = contentOf(get("/api/posts?siteId=" + siteId + "&limit=2", owner));
        String second = contentOf(get("/api/posts?siteId=" + siteId + "&limit=2&cursor=" + read(first, "$.nextCursor"), owner));

        assertThat(JsonPath.<List<String>>read(first, "$.items[*].body")).containsExactly("üçüncü", "ikinci");
        assertThat(JsonPath.<List<String>>read(second, "$.items[*].body")).containsExactly("birinci");
        assertThat(JsonPath.<Object>read(second, "$.nextCursor")).isNull();
    }
}
