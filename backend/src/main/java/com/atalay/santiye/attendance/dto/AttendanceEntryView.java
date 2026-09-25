package com.atalay.santiye.attendance.dto;

import com.atalay.santiye.attendance.AbsenceReason;
import com.atalay.santiye.attendance.AttendanceStatus;
import jakarta.annotation.Nullable;

public record AttendanceEntryView(
    WorkerView worker,
    AttendanceStatus status,
    @Nullable AbsenceReason reason,
    @Nullable String note) {
}
