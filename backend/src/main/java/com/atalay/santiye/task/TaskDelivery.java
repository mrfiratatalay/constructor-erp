package com.atalay.santiye.task;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

/**
 * Bir iş teslimi: hangi görev, sohbetteki fotoğraflı mesajı, kim ne zaman teslim etti; şef ya da patron inceleyince
 * kim ne zaman, eksik varsa notu ve fotoğraftaki nokta. Her teslim ayrı satırdır: iş gidip gelse de geçmişi kalır.
 */
@Entity
@Table(name = "task_deliveries")
class TaskDelivery {

    @Id
    private UUID id;
    private UUID taskId;
    private UUID companyId;
    private UUID postId;
    private UUID deliveredBy;
    private Instant deliveredAt;
    @Enumerated(EnumType.STRING)
    private DeliveryStatus status;
    private UUID reviewedBy;
    private Instant reviewedAt;
    private String missingNote;
    private UUID markMediaId;
    // Tek harfli sonek sütun adına kendiliğinden çevrilmez (markX → "markx"): adı açıkça yazılır.
    @Column(name = "mark_x")
    private Float markX;
    @Column(name = "mark_y")
    private Float markY;

    protected TaskDelivery() {
    }

    TaskDelivery(UUID id, Task task, UUID postId, UUID deliveredBy, Instant deliveredAt) {
        this.id = id;
        this.taskId = task.getId();
        this.companyId = task.getCompanyId();
        this.postId = postId;
        this.deliveredBy = deliveredBy;
        this.deliveredAt = deliveredAt;
        this.status = DeliveryStatus.PENDING;
    }

    void approve(UUID by, Instant at) {
        this.status = DeliveryStatus.APPROVED;
        this.reviewedBy = by;
        this.reviewedAt = at;
    }

    /** Eksik var: not zorunludur; nokta, fotoğraflardan birinin üstünde eksik olan yerdir (isteğe bağlı). */
    void sendBack(UUID by, Instant at, MissingWork missing) {
        this.status = DeliveryStatus.RETURNED;
        this.reviewedBy = by;
        this.reviewedAt = at;
        this.missingNote = missing.note();
        this.markMediaId = missing.mediaId();
        this.markX = missing.x();
        this.markY = missing.y();
    }

    boolean isPending() {
        return status == DeliveryStatus.PENDING;
    }

    UUID getId() {
        return id;
    }

    UUID getTaskId() {
        return taskId;
    }

    UUID getCompanyId() {
        return companyId;
    }

    UUID getPostId() {
        return postId;
    }

    UUID getDeliveredBy() {
        return deliveredBy;
    }

    Instant getDeliveredAt() {
        return deliveredAt;
    }

    DeliveryStatus getStatus() {
        return status;
    }

    UUID getReviewedBy() {
        return reviewedBy;
    }

    Instant getReviewedAt() {
        return reviewedAt;
    }

    String getMissingNote() {
        return missingNote;
    }

    UUID getMarkMediaId() {
        return markMediaId;
    }

    Float getMarkX() {
        return markX;
    }

    Float getMarkY() {
        return markY;
    }
}
