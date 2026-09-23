package com.atalay.santiye.task;

import com.atalay.santiye.site.Site;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "tasks")
public class Task {

    @Id
    private UUID id;
    private UUID companyId;
    private UUID siteId;
    private String title;
    private String note;
    private UUID assigneeId;
    private LocalDate dueDate;
    @Enumerated(EnumType.STRING)
    private TaskStatus status;
    @Enumerated(EnumType.STRING)
    private TaskPriority priority;
    private UUID postId;
    private UUID createdBy;
    private Instant createdAt;
    private Instant completedAt;

    protected Task() {
    }

    /** Görev "yapılacak" olarak doğar; bağlı gönderisi sonradan değişmez. */
    Task(Site site, UUID createdBy, UUID postId, Instant createdAt) {
        this.id = UUID.randomUUID();
        this.companyId = site.getCompanyId();
        this.siteId = site.getId();
        this.createdBy = createdBy;
        this.postId = postId;
        this.createdAt = createdAt;
        this.status = TaskStatus.TODO;
    }

    void describe(TaskContent content) {
        this.title = content.title();
        this.note = content.note();
        this.assigneeId = content.assigneeId();
        this.dueDate = content.dueDate();
        this.priority = content.priority();
    }

    /** Tamamlanma anı tutulur; görev yeniden açılırsa silinir. */
    void moveTo(TaskStatus next, Instant at) {
        if (next == TaskStatus.DONE && status != TaskStatus.DONE) {
            completedAt = at;
        }
        if (next != TaskStatus.DONE) {
            completedAt = null;
        }
        status = next;
    }

    public UUID getId() {
        return id;
    }

    public UUID getSiteId() {
        return siteId;
    }

    public String getTitle() {
        return title;
    }

    public String getNote() {
        return note;
    }

    public UUID getAssigneeId() {
        return assigneeId;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public TaskStatus getStatus() {
        return status;
    }

    public TaskPriority getPriority() {
        return priority;
    }

    public UUID getPostId() {
        return postId;
    }

    public UUID getCreatedBy() {
        return createdBy;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getCompletedAt() {
        return completedAt;
    }
}
