package com.atalay.santiye.attendance.dto;

import com.atalay.santiye.attendance.AbsenceReason;
import com.atalay.santiye.attendance.AttendanceStatus;
import jakarta.annotation.Nullable;
import java.time.LocalDate;

public record WorkerAttendanceDay(
    LocalDate day,
    AttendanceStatus status,
    @Nullable AbsenceReason reason,
    @Nullable String note) {
}
