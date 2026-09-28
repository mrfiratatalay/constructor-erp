package com.atalay.santiye.task;

import static org.assertj.core.api.Assertions.assertThat;

import com.atalay.santiye.support.IntegrationTest;
import com.atalay.santiye.support.PostDraft;
import com.jayway.jsonpath.JsonPath;
import jakarta.servlet.http.Cookie;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.junit.jupiter.api.Test;

@IntegrationTest
class TaskCardTest extends DeliveryTestSupport {

    /** Şantiyenin sohbetindeki, göreve bağlı mesaj (görev kartı). */
    private Map<String, Object> cardOf(Cookie session, String siteId, String taskId) {
        List<Map<String, Object>> cards = JsonPath.read(contentOf(get("/api/posts?siteId=" + siteId, session)),
            "$.items[?(@.taskId == '%s')]".formatted(taskId));
        assertThat(cards).hasSize(1);
        return cards.getFirst();
    }

    @Test
    void aNewTaskDropsACardIntoTheSitesChat() {
        Cookie owner = loginAsOwner();
        String siteId = createSite(owner, "Kart " + UUID.randomUUID());
        Cookie worker = signedInWorker(owner, "Kalıpçı Ali");
        String taskId = createTask(owner, siteId, "Kalıp sökülecek", userIdOf(worker));

        Map<String, Object> card = cardOf(worker, siteId, taskId);

        assertThat(card.get("body")).isEqualTo("📋 Görev: Kalıp sökülecek");
        String task = contentOf(get("/api/tasks/" + taskId, worker));
        assertThat(read(task, "$.title")).isEqualTo("Kalıp sökülecek");
        assertThat(read(task, "$.assignee.fullName")).isEqualTo("Kalıpçı Ali");
        assertThat(read(task, "$.status")).isEqualTo("TODO");
    }

    @Test
    void theDeliveryIsAReplyToTheTaskCard() {
        Cookie owner = loginAsOwner();
        String siteId = createSite(owner, "Zincir " + UUID.randomUUID());
        Cookie worker = signedInWorker(owner, "Zincir Usta");
        String taskId = createTask(owner, siteId, "Duvar örülecek", userIdOf(worker));
        Object cardId = cardOf(worker, siteId, taskId).get("id");

        String postId = read(contentOf(deliver(worker, taskId, photo())), "$.postId");

        String delivery = contentOf(get("/api/posts/" + postId, worker));
        assertThat((Object) JsonPath.read(delivery, "$.replyTo.id")).isEqualTo(cardId);
    }

    @Test
    void aTaskOpenedFromAMessageRepliesToThatMessage() {
        Cookie owner = loginAsOwner();
        String siteId = createSite(owner, "Mesajdan " + UUID.randomUUID());
        PostDraft note = PostDraft.to(siteId, "Pencere camı çatlak");
        sendPost(owner, note);
        String json = "{\"title\": \"Cam değişecek\", \"priority\": \"NORMAL\", \"postId\": \"%s\"}".formatted(note.id());
        String taskId = read(contentOf(postJson("/api/sites/" + siteId + "/tasks", owner, json)), "$.id");

        Map<String, Object> card = cardOf(owner, siteId, taskId);

        assertThat(JsonPath.<String>read(card, "$.replyTo.id")).isEqualTo(note.id());
    }

    @Test
    void theCardIsNotCorrectedOrForwarded() {
        Cookie owner = loginAsOwner();
        String siteId = createSite(owner, "Kart kuralı " + UUID.randomUUID());
        String otherSiteId = createSite(owner, "Öbür " + UUID.randomUUID());
        String taskId = createTask(owner, siteId, "Boya", userIdOf(signedInWorker(owner, "Boyacı")));
        String postUri = "/api/posts/" + cardOf(owner, siteId, taskId).get("id");

        assertThat(patchJson(postUri, owner, "{\"body\": \"Başka\", \"issue\": false}")).hasStatus(409);
        assertThat(postJson(postUri + "/forward", owner, "{\"siteId\": \"%s\"}".formatted(otherSiteId)))
            .hasStatus(409);
    }
}
