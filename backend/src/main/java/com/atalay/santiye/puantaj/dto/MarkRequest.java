package com.atalay.santiye.puantaj.dto;

import com.atalay.santiye.puantaj.DayStatus;
import jakarta.annotation.Nullable;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

/**
 * Bir günü işaretlemek: önce durum, gerekiyorsa mesai (yalnızca Geldi gününe, yarım saatlik adımla) ve not. Mesai
 * en çok iki basamak ve iki ondalıktır: "1e999999999" gibi kısa ama devasa bir sayı hesaba hiç girmez.
 */
public record MarkRequest(
    @NotNull DayStatus status,
    @Nullable @Digits(integer = 2, fraction = 2) BigDecimal overtimeHours,
    @Nullable @Size(max = 200) String note) {
}
