package com.atalay.santiye.site.dto;

import com.atalay.santiye.site.SiteEventKind;
import jakarta.annotation.Nullable;
import java.time.Instant;
import java.util.UUID;

/** Sistem satırı. actorName boşsa işi yapan bilinmiyor: "Musa eklendi" diye okunur. */
public record SiteEventView(
    UUID id,
    UUID siteId,
    SiteEventKind kind,
    @Nullable UUID actorId,
    @Nullable String actorName,
    @Nullable UUID subjectId,
    @Nullable String subjectName,
    Instant createdAt) {
}
