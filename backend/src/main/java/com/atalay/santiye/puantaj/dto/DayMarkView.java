package com.atalay.santiye.puantaj.dto;

import com.atalay.santiye.puantaj.DayStatus;
import jakarta.annotation.Nullable;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

/** Bir kalemin bir günü. overtimeHours: yalnızca geldiği gün, saat. markedByName ve markedAt: işaretin izi. */
public record DayMarkView(
    UUID entryId,
    LocalDate day,
    DayStatus status,
    @Nullable BigDecimal overtimeHours,
    @Nullable String note,
    String markedByName,
    Instant markedAt) {
}
