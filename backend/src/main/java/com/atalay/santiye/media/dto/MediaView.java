package com.atalay.santiye.media.dto;

import com.atalay.santiye.media.MediaKind;
import com.atalay.santiye.media.MediaStatus;
import jakarta.annotation.Nullable;
import java.time.Instant;
import java.util.UUID;

/**
 * Adresler yalnızca dosya hazır olduğunda (READY) dolu gelir. fileName ve sizeBytes belgenin satırında
 * ("Proje.pdf · 2,4 MB") gösterilir; createdAt galeride aylara ayırmak içindir.
 */
public record MediaView(
    UUID id,
    MediaKind kind,
    MediaStatus status,
    @Nullable Double durationSeconds,
    @Nullable String url,
    @Nullable String thumbnailUrl,
    @Nullable String fileName,
    long sizeBytes,
    Instant createdAt) {
}
