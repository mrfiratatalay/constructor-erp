package com.atalay.santiye.media.dto;

import com.atalay.santiye.media.MediaKind;
import com.atalay.santiye.media.MediaStatus;
import jakarta.annotation.Nullable;
import java.util.UUID;

/** Adresler yalnızca dosya hazır olduğunda (READY) dolu gelir. */
public record MediaView(
    UUID id,
    MediaKind kind,
    MediaStatus status,
    @Nullable Double durationSeconds,
    @Nullable String url,
    @Nullable String thumbnailUrl) {
}
