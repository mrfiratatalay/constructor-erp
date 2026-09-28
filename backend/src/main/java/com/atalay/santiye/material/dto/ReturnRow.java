package com.atalay.santiye.material.dto;

import com.atalay.santiye.material.MovementStatus;
import jakarta.annotation.Nullable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

/**
 * İadesi beklenen ödünç çıkışı: "ABC İnşaat · Kalıp Malzemesi · verilen 100, dönen 60, kalan 40 Adet · 05.10.2026".
 * "İade Al" bu satırdan girilir; malzeme ve firma çıkıştan gelir, yanlış ilişki kurulamaz.
 */
public record ReturnRow(
    UUID movementId,
    long number,
    LocalDate day,
    UUID materialId,
    String materialName,
    String unit,
    @Nullable String partyName,
    String sourceName,
    BigDecimal quantity,
    BigDecimal returned,
    BigDecimal remaining,
    @Nullable LocalDate expectedReturnDate,
    @Nullable String returnNote,
    MovementStatus status) {
}
