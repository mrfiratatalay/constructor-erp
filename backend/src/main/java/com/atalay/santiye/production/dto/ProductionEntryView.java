package com.atalay.santiye.production.dto;

import com.atalay.santiye.media.dto.MediaView;
import jakarta.annotation.Nullable;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

/**
 * Bir günlük giriş: "28 Eylül · +3,5 ton · 12 çalışan · not · 3 fotoğraf · Mehmet Şef 16:42". day: işin yapıldığı
 * gün (geçmiş güne de girilebilir); createdAt: girildiği an. onField: Saha'ya yansıtıldı. media: fotoğraf ve PDF.
 */
public record ProductionEntryView(
    UUID id,
    UUID itemId,
    LocalDate day,
    BigDecimal quantity,
    @Nullable Integer workerCount,
    @Nullable String note,
    String authorName,
    Instant createdAt,
    boolean onField,
    List<MediaView> media) {
}
