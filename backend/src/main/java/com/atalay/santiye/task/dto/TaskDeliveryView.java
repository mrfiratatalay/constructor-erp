package com.atalay.santiye.task.dto;

import com.atalay.santiye.media.dto.MediaView;
import com.atalay.santiye.task.DeliveryStatus;
import com.atalay.santiye.task.TaskStatus;
import jakarta.annotation.Nullable;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

/**
 * Bir iş teslimi, sohbetteki kartın ihtiyacı kadar. postId: fotoğraflı teslim mesajı. reviewedBy, reviewedAt: şef ya
 * da patron incelediyse. missingNote, mark: eksik varsa. canReview: bakan kişi onaylayabilir ya da eksik diyebilir.
 * canRedeliver: bakan kişi işin sorumlusu, iş eksiğiyle ona dönmüş ve bu en son teslim.
 */
public record TaskDeliveryView(
    UUID id,
    UUID taskId,
    String taskTitle,
    TaskStatus taskStatus,
    String siteName,
    DeliveryStatus status,
    TaskPerson deliveredBy,
    Instant deliveredAt,
    UUID postId,
    List<MediaView> photos,
    @Nullable TaskPerson reviewedBy,
    @Nullable Instant reviewedAt,
    @Nullable String missingNote,
    @Nullable DeliveryMark mark,
    boolean canReview,
    boolean canRedeliver) {
}
