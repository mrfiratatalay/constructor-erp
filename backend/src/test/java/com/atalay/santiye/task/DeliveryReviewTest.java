package com.atalay.santiye.task;

import static org.assertj.core.api.Assertions.assertThat;

import com.atalay.santiye.support.IntegrationTest;
import com.jayway.jsonpath.JsonPath;
import jakarta.servlet.http.Cookie;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.assertj.MvcTestResult;

@IntegrationTest
class DeliveryReviewTest extends DeliveryTestSupport {

    /** Bir şantiye, bir çalışan, ona verilmiş bir iş ve bu işin fotoğraflı teslimi. */
    private record Delivered(String siteId, String taskId, Cookie worker, String delivery) {
    }

    private Delivered deliveredTask(Cookie owner, String title) {
        String siteId = createSite(owner, title + " " + UUID.randomUUID());
        Cookie worker = signedInWorker(owner, "Usta " + UUID.randomUUID().toString().substring(0, 6));
        String taskId = createTask(owner, siteId, title, userIdOf(worker));
        String delivery = contentOf(deliver(worker, taskId, photo(), photo()));
        return new Delivered(siteId, taskId, worker, delivery);
    }

    private MvcTestResult approve(Cookie session, String delivery) {
        return postJson("/api/deliveries/" + read(delivery, "$.id") + "/approve", session, "{}");
    }

    private MvcTestResult sendBack(Cookie session, String delivery, String json) {
        return postJson("/api/deliveries/" + read(delivery, "$.id") + "/return", session, json);
    }

    private static String missing(String note, String mediaId) {
        return "{\"note\": \"%s\", \"mark\": {\"mediaId\": \"%s\", \"x\": 0.4, \"y\": 0.6}}".formatted(note, mediaId);
    }

    @Test
    void theLeadApprovesAndTheTaskIsDoneWithWhoAndWhen() {
        Cookie owner = loginAsOwner();
        Cookie lead = signedInLead(owner, "Kontrol Şefi");
        Delivered delivered = deliveredTask(owner, "Banyo tesisatı");

        String approved = contentOf(approve(lead, delivered.delivery()));

        assertThat(read(approved, "$.status")).isEqualTo("APPROVED");
        assertThat(read(approved, "$.taskStatus")).isEqualTo("DONE");
        assertThat(read(approved, "$.reviewedBy.fullName")).isEqualTo("Kontrol Şefi");
        assertThat((Object) JsonPath.read(approved, "$.reviewedAt")).isNotNull();
        String tasks = contentOf(get("/api/sites/" + delivered.siteId() + "/tasks", owner));
        assertThat((Object) JsonPath.read(tasks, "$[0].completedAt")).isNotNull();
        List<String> bodies = JsonPath.read(contentOf(get("/api/posts?siteId=" + delivered.siteId(), owner)),
            "$.items[*].body");
        assertThat(bodies).contains("✅ Onaylandı: Banyo tesisatı");
    }

    @Test
    void theLeadMarksWhatIsMissingAndTheWorkerDeliversAgain() {
        Cookie owner = loginAsOwner();
        Cookie lead = signedInLead(owner, "Titiz Şef");
        Delivered delivered = deliveredTask(owner, "3. Kat Elektrik");
        String photoId = read(delivered.delivery(), "$.photos[1].id");

        String returned = contentOf(sendBack(lead, delivered.delivery(), missing("Buradaki kablo eksik", photoId)));

        assertThat(read(returned, "$.status")).isEqualTo("RETURNED");
        assertThat(read(returned, "$.taskStatus")).isEqualTo("RETURNED");
        assertThat(read(returned, "$.missingNote")).isEqualTo("Buradaki kablo eksik");
        assertThat(read(returned, "$.mark.mediaId")).isEqualTo(photoId);
        String workersView = contentOf(get("/api/deliveries/" + read(returned, "$.id"), delivered.worker()));
        assertThat((Boolean) JsonPath.read(workersView, "$.canRedeliver")).isTrue();
        assertThat(deliver(delivered.worker(), delivered.taskId(), photo())).hasStatus(201);
        String afterRedelivery = contentOf(get("/api/deliveries/" + read(returned, "$.id"), delivered.worker()));
        assertThat((Boolean) JsonPath.read(afterRedelivery, "$.canRedeliver")).isFalse();
    }

    @Test
    void onlyALeadOrTheOwnerReviewsNeverTheirOwnAndOnlyOnce() {
        Cookie owner = loginAsOwner();
        Delivered delivered = deliveredTask(owner, "Duvar");
        Cookie lead = signedInLead(owner, "Kendi İşini Yapan Şef");
        String siteId = createSite(owner, "Şefin işi " + UUID.randomUUID());
        String leadsTask = createTask(owner, siteId, "Boya", userIdOf(lead));
        String leadsDelivery = contentOf(deliver(lead, leadsTask, photo()));

        assertThat(approve(delivered.worker(), delivered.delivery())).hasStatus(403);
        assertThat(approve(lead, leadsDelivery)).hasStatus(403).bodyJson().extractingPath("$.detail")
            .isEqualTo("Kendi teslimini onaylayamazsın.");
        assertThat(approve(owner, leadsDelivery)).hasStatus(200);
        assertThat(approve(owner, leadsDelivery)).hasStatus(409);
    }

    @Test
    void theMarkBelongsToThisDeliveryAndTheNoteIsRequired() {
        Cookie owner = loginAsOwner();
        Delivered delivered = deliveredTask(owner, "Tuğla duvar");
        Delivered other = deliveredTask(owner, "Başka iş");
        String otherPhoto = read(other.delivery(), "$.photos[0].id");

        assertThat(sendBack(owner, delivered.delivery(), missing("Eksik", otherPhoto))).hasStatus(400);
        assertThat(sendBack(owner, delivered.delivery(), "{\"note\": \"  \"}")).hasStatus(400);
        assertThat(sendBack(owner, delivered.delivery(), "{\"note\": \"Derz eksik\"}")).hasStatus(200);
    }
}
