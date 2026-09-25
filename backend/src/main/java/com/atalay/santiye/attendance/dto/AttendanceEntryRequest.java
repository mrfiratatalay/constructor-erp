package com.atalay.santiye.attendance.dto;

import com.atalay.santiye.attendance.AbsenceReason;
import com.atalay.santiye.attendance.AttendanceStatus;
import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.UUID;

/** reason yalnızca ABSENT'te verilir ve orada zorunludur; not her durumda isteğe bağlıdır. */
public record AttendanceEntryRequest(
    @NotNull UUID workerId,
    @NotNull AttendanceStatus status,
    @Nullable AbsenceReason reason,
    @Nullable @Size(max = 500) String note) {
}
