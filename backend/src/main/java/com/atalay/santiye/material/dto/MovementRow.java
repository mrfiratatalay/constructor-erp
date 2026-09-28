package com.atalay.santiye.material.dto;

import com.atalay.santiye.material.MovementPurpose;
import com.atalay.santiye.material.MovementStatus;
import com.atalay.santiye.material.MovementType;
import jakarta.annotation.Nullable;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

/**
 * Hareket tablosunun bir satırı. number: okunur hareket numarası (MH-000123). source ve destination türe göre boş
 * olabilir (Geldi'nin kaynağı firmadır, Kullanıldı'nın hedefi kullanım alanıdır). unit: malzemenin ana birimi.
 */
public record MovementRow(
    UUID id,
    long number,
    LocalDate day,
    MovementType type,
    MovementStatus status,
    BigDecimal quantity,
    String unit,
    UUID materialId,
    String materialName,
    @Nullable String materialCode,
    String category,
    @Nullable LocationRef source,
    @Nullable LocationRef destination,
    @Nullable UUID partyId,
    @Nullable String partyName,
    @Nullable MovementPurpose purpose,
    @Nullable String usageArea,
    @Nullable String description,
    @Nullable LocalDate expectedReturnDate,
    String createdByName,
    Instant createdAt,
    int documentCount) {
}
