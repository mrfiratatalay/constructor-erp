package com.atalay.santiye.auth;

import java.time.Instant;
import java.util.UUID;

/** Kullanıcının en son ne zaman uygulamayı açtığı: patron davetin kullanılıp kullanılmadığını görür. */
public record LastSeen(UUID userId, Instant lastSeenAt) {
}
