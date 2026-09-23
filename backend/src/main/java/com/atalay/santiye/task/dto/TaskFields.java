package com.atalay.santiye.task.dto;

import com.atalay.santiye.task.TaskPriority;
import java.time.LocalDate;
import java.util.UUID;

/** Açarken ve düzenlerken aynı olan alanlar: servis ikisini tek yoldan doğrular. */
public interface TaskFields {

    String title();

    String note();

    UUID assigneeId();

    LocalDate dueDate();

    TaskPriority priority();
}
