package com.atalay.santiye.platform.dto;

import jakarta.annotation.Nullable;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

/** Bir abonelik dönemi; state bugünün gözüyle (EXPIRED hesaplanır). */
public record SubscriptionView(UUID id, UUID planId, String planName, String status, String state, LocalDate startsOn,
    LocalDate endsOn, @Nullable BigDecimal priceSnapshot, String currency, @Nullable String note, Instant createdAt) {
}
