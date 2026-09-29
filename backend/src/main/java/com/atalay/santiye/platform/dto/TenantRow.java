package com.atalay.santiye.platform.dto;

import jakarta.annotation.Nullable;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

/**
 * Firma listesinin satırı. subscriptionState: ACTIVE, SCHEDULED, EXPIRED, SUSPENDED, CANCELLED ya da boş (hiç dönem
 * yok). open: çalışma alanı bugün açık mı (firma aktif ve dönem geçerli).
 */
public record TenantRow(
    UUID id,
    String name,
    String slug,
    String status,
    @Nullable String city,
    @Nullable String planName,
    @Nullable String subscriptionState,
    @Nullable LocalDate endsOn,
    @Nullable Long daysLeft,
    boolean open,
    long userCount,
    long siteCount,
    @Nullable Instant lastActivityAt,
    boolean setupCompleted,
    Instant createdAt) {
}
