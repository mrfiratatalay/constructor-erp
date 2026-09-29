package com.atalay.santiye.onboarding.dto;

import jakarta.annotation.Nullable;
import java.time.Instant;
import java.util.UUID;

/** Platform yönetiminde davet geçmişi. status: PENDING, USED, REVOKED ya da EXPIRED (süresi geçmiş bekleyen). */
public record OnboardingInviteView(UUID id, String status, Instant createdAt, Instant expiresAt,
    @Nullable Instant usedAt, @Nullable String usedByName, @Nullable String createdByName) {
}
