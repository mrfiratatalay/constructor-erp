package com.atalay.santiye.task;

import java.time.LocalDate;
import java.util.UUID;

/** Görevin elle değiştirilebilen alanları; doğrulanmış ve temizlenmiş hâliyle. */
record TaskContent(String title, String note, UUID assigneeId, LocalDate dueDate, TaskPriority priority) {
}
