package com.atalay.santiye.material.dto;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

/**
 * Sayım düzeltmesi: bir lokasyonda fiziksel olarak sayılan miktar. Sistem miktarı sunucuda hesaplanır; fark ayrı bir
 * hareket olarak kaydedilir, eski hareketler değişmez. Neden zorunlu (Fire, Kayıp, Hasar, Sayım hatası…).
 */
public record AdjustmentRequest(
    @NotNull UUID id,
    @NotNull UUID materialId,
    @NotNull UUID locationId,
    @NotNull @PositiveOrZero @Digits(integer = 11, fraction = 3) BigDecimal countedQuantity,
    @NotBlank @Size(max = 120) String reason,
    @NotNull LocalDate day,
    @Nullable @Size(max = 500) String note) {
}
