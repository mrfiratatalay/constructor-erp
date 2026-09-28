package com.atalay.santiye.puantaj.dto;

import com.atalay.santiye.puantaj.DayStatus;
import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

/** Bir günü işaretlemek: önce durum, gerekiyorsa mesai (yalnızca Geldi gününe, yarım saatlik adımla) ve not. */
public record MarkRequest(
    @NotNull DayStatus status,
    @Nullable BigDecimal overtimeHours,
    @Nullable @Size(max = 200) String note) {
}
