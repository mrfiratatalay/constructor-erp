package com.atalay.santiye.production.dto;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

/**
 * İmalat açmak ya da düzeltmek. trade: imalat türü ("Demir İşleri"; listeden seçilir ya da yeni yazılır). title:
 * isteğe bağlı özel ad ("A Blok Demir İşleri"). crewId: taşeron (puantajın ekibi), henüz atanmadıysa boş. unit:
 * birim ("ton", "m²", "adet", "%"). plannedEnd: gecikme buna göre hesaplanır.
 */
public record ProductionItemRequest(
    @NotBlank @Size(max = 60) String trade,
    @Nullable @Size(max = 120) String title,
    @Nullable UUID crewId,
    @NotNull @Positive @Digits(integer = 11, fraction = 3) BigDecimal totalQuantity,
    @NotBlank @Size(max = 12) String unit,
    @Nullable LocalDate startDate,
    @Nullable LocalDate plannedEnd,
    @Nullable @Size(max = 500) String note) {
}
