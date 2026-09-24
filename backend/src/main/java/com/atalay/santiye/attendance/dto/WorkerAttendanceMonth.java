package com.atalay.santiye.attendance.dto;

import java.util.List;
import java.util.UUID;

/** Bir personelin bir ayı: kaç gün geldi / gelmedi / izinliydi ve gün gün, en yeni üstte. */
public record WorkerAttendanceMonth(
    WorkerView worker,
    UUID siteId,
    String month,
    AttendanceCounts counts,
    List<WorkerAttendanceDay> days) {
}
