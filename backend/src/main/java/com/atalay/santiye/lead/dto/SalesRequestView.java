package com.atalay.santiye.lead.dto;

import jakarta.annotation.Nullable;
import java.time.Instant;
import java.util.UUID;

/** Platform yönetiminde başvuru satırı; companyId doluysa başvuru firmaya dönüşmüştür. */
public record SalesRequestView(UUID id, String companyName, String contactName, String phone, @Nullable String email,
    @Nullable String city, @Nullable Integer siteCount, @Nullable UUID planId, @Nullable String planName,
    @Nullable String message, String status, @Nullable String notes, @Nullable UUID companyId,
    @Nullable String convertedCompanyName, Instant createdAt) {
}
