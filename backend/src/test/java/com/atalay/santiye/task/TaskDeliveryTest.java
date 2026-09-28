package com.atalay.santiye.task;

import static org.assertj.core.api.Assertions.assertThat;

import com.atalay.santiye.support.IntegrationTest;
import com.jayway.jsonpath.JsonPath;
import jakarta.servlet.http.Cookie;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.assertj.MvcTestResult;

@IntegrationTest
class TaskDeliveryTest extends DeliveryTestSupport {

    @Test
    void theWorkerDeliversTheirTaskWithPhotosAndItWaitsForReview() {
        Cookie owner = loginAsOwner();
        String siteId = createSite(owner, "Teslim " + UUID.randomUUID());
        Cookie worker = signedInWorker(owner, "Elektrikçi Ali");
        String taskId = createTask(owner, siteId, "3. Kat Elektrik", userIdOf(worker));

        MvcTestResult result = deliver(worker, taskId, photo(), photo());

        assertThat(result).hasStatus(201);
        String delivery = contentOf(result);
        assertThat(read(delivery, "$.status")).isEqualTo("PENDING");
        assertThat(read(delivery, "$.taskStatus")).isEqualTo("SUBMITTED");
        assertThat(read(delivery, "$.deliveredBy.fullName")).isEqualTo("Elektrikçi Ali");
        assertThat((List<Object>) JsonPath.read(delivery, "$.photos")).hasSize(2);
        String post = contentOf(get("/api/posts/" + read(delivery, "$.postId"), owner));
        assertThat(read(post, "$.deliveryId")).isEqualTo(read(delivery, "$.id"));
        assertThat(read(post, "$.body")).isEqualTo("✅ İş teslim edildi: 3. Kat Elektrik");
    }

    @Test
    void onlyTheAssigneeDeliversAndOnlyOnceUntilReviewed() {
        Cookie owner = loginAsOwner();
        String siteId = createSite(owner, "Sorumlu " + UUID.randomUUID());
        Cookie worker = signedInWorker(owner, "Boyacı Hasan");
        Cookie other = signedInWorker(owner, "Başka Usta");
        String taskId = createTask(owner, siteId, "Boya", userIdOf(worker));

        assertThat(deliver(other, taskId, photo())).hasStatus(403);
        assertThat(deliver(worker, taskId, photo())).hasStatus(201);
        assertThat(deliver(worker, taskId, photo())).hasStatus(409).bodyJson().extractingPath("$.detail")
            .isEqualTo("Bu iş zaten teslim edildi; şefin kontrolünü bekliyor.");
        assertThat(get("/api/sites/" + siteId + "/tasks", owner)).bodyJson()
            .extractingPath("$[0].status").isEqualTo("SUBMITTED");
    }

    @Test
    void aDeliveryNeedsPhotosAndOnlyPhotos() {
        Cookie owner = loginAsOwner();
        String siteId = createSite(owner, "Fotoğraf " + UUID.randomUUID());
        Cookie worker = signedInWorker(owner, "Duvarcı Veli");
        String taskId = createTask(owner, siteId, "Duvar", userIdOf(worker));
        var pdf = new MockMultipartFile("photos", "rapor.pdf", "application/pdf", new byte[] {1, 2, 3});

        assertThat(deliver(worker, taskId)).hasStatus(400);
        assertThat(deliver(worker, taskId, pdf)).hasStatus(400);
    }

    @Test
    void aDeliveryIsEvidenceItIsNotDeletedOrForwarded() {
        Cookie owner = loginAsOwner();
        String siteId = createSite(owner, "Kanıt " + UUID.randomUUID());
        String otherSiteId = createSite(owner, "Öbür " + UUID.randomUUID());
        Cookie worker = signedInWorker(owner, "Tesisatçı Kemal");
        String taskId = createTask(owner, siteId, "Banyo tesisatı", userIdOf(worker));
        String postId = read(contentOf(deliver(worker, taskId, photo())), "$.postId");

        assertThat(delete("/api/posts/" + postId, owner)).hasStatus(409);
        assertThat(delete("/api/posts/" + postId, worker)).hasStatus(409);
        assertThat(postJson("/api/posts/" + postId + "/forward", worker, "{\"siteId\": \"%s\"}".formatted(otherSiteId)))
            .hasStatus(409);
    }
}
