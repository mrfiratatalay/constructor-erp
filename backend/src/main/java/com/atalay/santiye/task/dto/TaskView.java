package com.atalay.santiye.task.dto;

import com.atalay.santiye.task.TaskPriority;
import com.atalay.santiye.task.TaskStatus;
import jakarta.annotation.Nullable;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

/** postId: bağlı akış gönderisi (fotoğraf/not). completedAt: tamamlandıysa ne zaman. */
public record TaskView(
    UUID id,
    UUID siteId,
    String title,
    @Nullable String note,
    TaskStatus status,
    TaskPriority priority,
    @Nullable LocalDate dueDate,
    @Nullable TaskPerson assignee,
    TaskPerson createdBy,
    @Nullable UUID postId,
    Instant createdAt,
    @Nullable Instant completedAt) {
}
