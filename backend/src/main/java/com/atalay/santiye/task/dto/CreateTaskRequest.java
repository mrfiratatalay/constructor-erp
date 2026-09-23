package com.atalay.santiye.task.dto;

import com.atalay.santiye.task.TaskPriority;
import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.util.UUID;

/** postId: görevin fotoğrafı ya da notu olan akış gönderisi; yalnızca açarken verilir. */
public record CreateTaskRequest(
    @NotBlank @Size(max = 200) String title,
    @Nullable @Size(max = 2000) String note,
    @Nullable UUID assigneeId,
    @Nullable LocalDate dueDate,
    @NotNull TaskPriority priority,
    @Nullable UUID postId) implements TaskFields {
}
