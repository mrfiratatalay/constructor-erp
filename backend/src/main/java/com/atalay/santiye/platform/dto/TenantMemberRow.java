package com.atalay.santiye.platform.dto;

import jakarta.annotation.Nullable;
import java.time.Instant;
import java.util.UUID;

/** Firmanın bir kişisi (platform yönetiminin gözüyle, salt okunur). */
public record TenantMemberRow(UUID userId, String fullName, @Nullable String phone, @Nullable String email,
    String role, boolean active, Instant createdAt, @Nullable Instant lastSeenAt) {
}
