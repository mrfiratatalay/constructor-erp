package com.atalay.santiye.material.dto;

import com.atalay.santiye.material.MovementStatus;
import com.atalay.santiye.material.MovementType;
import jakarta.annotation.Nullable;
import java.time.LocalDate;
import java.util.UUID;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.format.annotation.DateTimeFormat.ISO;

/**
 * Hareket listesinin süzgeçleri; hepsi birlikte çalışır, boş olan uygulanmaz. locationId hareketin iki ucunda da
 * aranır (kaynak ya da hedef). q: malzeme adı ya da kodu, firma, lokasyon, açıklama, hareket numarası ("MH-000123").
 */
public record MovementFilter(
    @Nullable @DateTimeFormat(iso = ISO.DATE) LocalDate from,
    @Nullable @DateTimeFormat(iso = ISO.DATE) LocalDate to,
    @Nullable UUID locationId,
    @Nullable UUID materialId,
    @Nullable UUID partyId,
    @Nullable MovementType type,
    @Nullable MovementStatus status,
    @Nullable String category,
    @Nullable String q) {
}
