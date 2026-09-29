package com.atalay.santiye.production.dto;

import com.atalay.santiye.production.ProductionStatus;
import jakarta.annotation.Nullable;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

/**
 * Bir imalat ve sunucunun hesapladıkları. name: ekranda yazan ad (özel ad, yoksa tür). doneQuantity: girişlerin
 * toplamı; remainingQuantity ve percent (tek ondalık, %100'ü geçebilir) bundan. todayQuantity: bugünün girişleri.
 * status: hesaplanan durum. lastEntryAt: son girişin zamanı, girişi yoksa boş.
 */
public record ProductionItemView(
    UUID id,
    String trade,
    @Nullable String title,
    String name,
    @Nullable CrewRef crew,
    BigDecimal totalQuantity,
    String unit,
    BigDecimal doneQuantity,
    BigDecimal remainingQuantity,
    double percent,
    BigDecimal todayQuantity,
    ProductionStatus status,
    @Nullable LocalDate startDate,
    @Nullable LocalDate plannedEnd,
    @Nullable String note,
    @Nullable Instant lastEntryAt,
    Instant createdAt) {
}
