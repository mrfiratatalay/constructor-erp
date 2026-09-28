package com.atalay.santiye.task;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.common.error.ApiException;
import com.atalay.santiye.post.PostFeed;
import com.atalay.santiye.post.TaskCardMessage;
import com.atalay.santiye.post.TaskCards;
import com.atalay.santiye.post.dto.PostView;
import com.atalay.santiye.site.Site;
import com.atalay.santiye.site.SiteAccess;
import com.atalay.santiye.task.dto.CreateTaskRequest;
import com.atalay.santiye.task.dto.TaskFields;
import com.atalay.santiye.task.dto.TaskView;
import com.atalay.santiye.task.dto.UpdateTaskRequest;
import java.time.Clock;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Şantiyenin görevleri. Şantiyeyi gören herkes görevleri görür, açar ve günceller (gönderi gibi);
 * silmek yalnızca açanın ve patronun işidir. Görünmeyen şantiyenin görevi "bulunamadı" döner. Görev nereden
 * açılırsa açılsın (sohbetin ＋'sı ya da Görevler sayfası) sohbete görev kartı düşer (TaskCards).
 */
@Service
public class TaskService {

    private final TaskRepository tasks;
    private final SiteAccess siteAccess;
    private final TaskAssignees assignees;
    private final TaskViews views;
    private final PostFeed posts;
    private final TaskCards cards;
    private final Clock clock;

    TaskService(TaskRepository tasks, SiteAccess siteAccess, TaskAssignees assignees, TaskViews views,
        PostFeed posts, TaskCards cards, Clock clock) {
        this.tasks = tasks;
        this.siteAccess = siteAccess;
        this.assignees = assignees;
        this.views = views;
        this.posts = posts;
        this.cards = cards;
        this.clock = clock;
    }

    @Transactional(readOnly = true)
    public List<TaskView> listTasks(CurrentUser user, UUID siteId) {
        Site site = siteAccess.requireVisible(user, siteId);
        return views.of(tasks.findBySiteIdOrderByCreatedAt(site.getId()));
    }

    @Transactional
    public TaskView createTask(CurrentUser user, UUID siteId, CreateTaskRequest request) {
        Site site = siteAccess.requireVisible(user, siteId);
        Task task = new Task(site, user.userId(), linkedPost(user, site, request.postId()), clock.instant());
        task.describe(content(site, request));
        Task saved = tasks.save(task);
        cards.postCard(user, new TaskCardMessage(site.getId(), saved.getId(), "📋 Görev: " + saved.getTitle(),
            saved.getPostId()));
        return views.of(saved);
    }

    /** Sohbetteki görev kartı görevi buradan okur. */
    @Transactional(readOnly = true)
    public TaskView getTask(CurrentUser user, UUID taskId) {
        Task task = findTask(user, taskId);
        siteAccess.requireVisible(user, task.getSiteId());
        return views.of(task);
    }

    @Transactional
    public TaskView updateTask(CurrentUser user, UUID taskId, UpdateTaskRequest request) {
        Task task = findTask(user, taskId);
        Site site = siteAccess.requireVisible(user, task.getSiteId());
        task.describe(content(site, request));
        task.moveTo(request.status(), clock.instant());
        return views.of(task);
    }

    @Transactional
    public void deleteTask(CurrentUser user, UUID taskId) {
        Task task = findTask(user, taskId);
        siteAccess.requireVisible(user, task.getSiteId());
        if (!user.isOwner() && !task.getCreatedBy().equals(user.userId())) {
            throw ApiException.forbidden("Görevi yalnızca açan kişi ya da patron silebilir.");
        }
        tasks.delete(task);
    }

    private Task findTask(CurrentUser user, UUID taskId) {
        return tasks.findByIdAndCompanyId(taskId, user.companyId())
            .orElseThrow(() -> ApiException.notFound("Görev bulunamadı."));
    }

    private TaskContent content(Site site, TaskFields fields) {
        String note = fields.note() == null || fields.note().isBlank() ? null : fields.note().trim();
        return new TaskContent(fields.title().trim(), note, assignees.require(site, fields.assigneeId()),
            fields.dueDate(), fields.priority());
    }

    /** Görevin fotoğrafı ya da notu akıştaki gönderidir: aynı şantiyenin silinmemiş bir gönderisi olmalı. */
    private UUID linkedPost(CurrentUser user, Site site, UUID postId) {
        if (postId == null) {
            return null;
        }
        PostView post = posts.getPost(user, postId);
        if (!post.site().id().equals(site.getId()) || post.deletion() != null) {
            throw ApiException.badRequest("Görev yalnızca bu şantiyenin bir gönderisine bağlanabilir.");
        }
        return postId;
    }
}
