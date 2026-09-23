package com.atalay.santiye.task;

import static org.assertj.core.api.Assertions.assertThat;

import com.atalay.santiye.support.ApiTestSupport;
import com.atalay.santiye.support.IntegrationTest;
import com.atalay.santiye.support.PostDraft;
import jakarta.servlet.http.Cookie;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.assertj.MvcTestResult;

@IntegrationTest
class TaskFlowTest extends ApiTestSupport {

    private static final String TASK = """
        {"title": "%s", "note": "Kalıp sökülmeden önce", "assigneeId": %s, "dueDate": "2026-10-01",
         "priority": "HIGH", "postId": %s}""";

    /** Testte açılacak görev: yalnızca senaryodan senaryoya değişen alanlar. */
    private record Draft(String title, String assigneeId, String postId) {

        static Draft titled(String title) {
            return new Draft(title, null, null);
        }
    }

    private MvcTestResult createTask(Cookie session, String siteId, Draft draft) {
        String json = TASK.formatted(draft.title(), quoted(draft.assigneeId()), quoted(draft.postId()));
        return postJson("/api/sites/" + siteId + "/tasks", session, json);
    }

    private static String quoted(String value) {
        return value == null ? "null" : "\"" + value + "\"";
    }

    private String userIdOf(Cookie session) {
        return read(contentOf(get("/api/auth/me", session)), "$.id");
    }

    @Test
    void ownerAssignsATaskAndTheSiteLeadCompletesIt() {
        Cookie owner = loginAsOwner();
        String siteId = createSite(owner, "Görev Şantiyesi " + UUID.randomUUID());
        Cookie lead = signedInSiteLead(owner, "Görevli Usta", siteId);

        MvcTestResult created = createTask(owner, siteId, new Draft("Demir bağlantısı", userIdOf(lead), null));
        assertThat(created).hasStatus(201).bodyJson().extractingPath("$.assignee.fullName").isEqualTo("Görevli Usta");
        String taskId = read(contentOf(created), "$.id");

        assertThat(get("/api/sites/" + siteId + "/tasks", lead)).bodyJson()
            .extractingPath("$[0].status").isEqualTo("TODO");
        String done = """
            {"title": "Demir bağlantısı", "assigneeId": null, "dueDate": null, "priority": "NORMAL", "status": "DONE"}""";
        assertThat(putJson("/api/tasks/" + taskId, lead, done)).hasStatusOk().bodyJson()
            .extractingPath("$.completedAt").isNotNull();
    }

    @Test
    void theAssigneeMustBeOnTheSite() {
        Cookie owner = loginAsOwner();
        String siteId = createSite(owner, "Kendi " + UUID.randomUUID());
        String otherSite = createSite(owner, "Başka " + UUID.randomUUID());
        Cookie outsider = signedInSiteLead(owner, "Başka Şantiyeden", otherSite);

        assertThat(createTask(owner, siteId, new Draft("Yanlış kişi", userIdOf(outsider), null))).hasStatus(400)
            .bodyJson().extractingPath("$.detail").isEqualTo("Görevin sorumlusu bu şantiyede değil.");
    }

    @Test
    void aSiteLeadCannotSeeOrChangeTasksOfAnotherSite() {
        Cookie owner = loginAsOwner();
        String ownSite = createSite(owner, "Kendi " + UUID.randomUUID());
        String otherSite = createSite(owner, "Başka " + UUID.randomUUID());
        Cookie lead = signedInSiteLead(owner, "Sınırlı Usta", ownSite);
        String taskId = read(contentOf(createTask(owner, otherSite, Draft.titled("Gizli iş"))), "$.id");

        assertThat(get("/api/sites/" + otherSite + "/tasks", lead)).hasStatus(404);
        assertThat(delete("/api/tasks/" + taskId, lead)).hasStatus(404);
    }

    @Test
    void aTaskLinksOnlyAPostOfItsOwnSite() {
        Cookie owner = loginAsOwner();
        String siteId = createSite(owner, "Fotoğraflı " + UUID.randomUUID());
        String otherSite = createSite(owner, "Öteki " + UUID.randomUUID());
        PostDraft photoNote = PostDraft.to(siteId, "Çatlak burada");
        PostDraft elsewhere = PostDraft.to(otherSite, "Başka şantiyenin notu");
        sendPost(owner, photoNote);
        sendPost(owner, elsewhere);

        assertThat(createTask(owner, siteId, new Draft("Çatlağı onar", null, photoNote.id()))).hasStatus(201)
            .bodyJson().extractingPath("$.postId").isEqualTo(photoNote.id());
        assertThat(createTask(owner, siteId, new Draft("Yanlış bağlantı", null, elsewhere.id()))).hasStatus(400);
    }

    @Test
    void onlyTheCreatorOrTheOwnerDeletesATask() {
        Cookie owner = loginAsOwner();
        String siteId = createSite(owner, "Silme " + UUID.randomUUID());
        Cookie lead = signedInSiteLead(owner, "Silmek İsteyen", siteId);
        String ownerTask = read(contentOf(createTask(owner, siteId, Draft.titled("Patronun işi"))), "$.id");
        String leadTask = read(contentOf(createTask(lead, siteId, Draft.titled("Ustanın işi"))), "$.id");

        assertThat(delete("/api/tasks/" + ownerTask, lead)).hasStatus(403);
        assertThat(delete("/api/tasks/" + leadTask, lead)).hasStatus(204);
        assertThat(delete("/api/tasks/" + ownerTask, owner)).hasStatus(204);
        assertThat(contentOf(get("/api/sites/" + siteId + "/tasks", owner))).isEqualTo("[]");
    }
}
