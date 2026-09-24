package com.atalay.santiye.visit.dto;

import jakarta.annotation.Nullable;
import java.time.Instant;
import java.util.UUID;

/** Bir katılımcının şantiyeye son bakışı; seenAt boşsa hiç bakmamış ya da (mesaj bilgisinde) henüz görmemiş. */
public record SeenBy(UUID userId, String fullName, @Nullable Instant seenAt) {
}
