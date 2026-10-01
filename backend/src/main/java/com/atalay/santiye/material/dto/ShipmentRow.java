package com.atalay.santiye.material.dto;

import com.atalay.santiye.material.ShipmentStatus;
import com.atalay.santiye.material.ShipmentType;
import jakarta.annotation.Nullable;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

/**
 * Listedeki bir sevkiyat. Kalemler özet olarak gelir ("Çimento 300 Torba, +2 kalem"); ayrıntı için satır açılır.
 * awaitingReturn: geri gelmesi bekleniyor ve iadesi henüz kaydedilmedi; daysOut o zaman doludur ("40 gündür dönmedi").
 */
public record ShipmentRow(
    UUID id,
    long number,
    ShipmentType type,
    ShipmentStatus status,
    @Nullable String fromName,
    @Nullable String toName,
    @Nullable String fromKind,
    @Nullable String toKind,
    LocalDate day,
    Instant createdAt,
    String createdByName,
    boolean expectsReturn,
    boolean awaitingReturn,
    @Nullable Integer daysOut,
    List<ShipmentLineView> lines) {
}
