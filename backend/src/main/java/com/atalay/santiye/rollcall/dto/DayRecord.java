package com.atalay.santiye.rollcall.dto;

import com.atalay.santiye.attendance.AbsenceReason;
import com.atalay.santiye.attendance.AttendanceStatus;
import jakarta.annotation.Nullable;
import java.time.Instant;

/**
 * Kişinin bir günlük kaydı. reason yalnızca Gelmedi'de. checkedInAt, siteName: kendisi katıldıysa ne zaman, hangi
 * şantiyede. markedByName, markedAt: patron işaretlediyse kim, ne zaman (katılma izi yine de kalır).
 */
public record DayRecord(
    AttendanceStatus status,
    @Nullable AbsenceReason reason,
    @Nullable Instant checkedInAt,
    @Nullable String siteName,
    @Nullable String markedByName,
    @Nullable Instant markedAt) {
}
