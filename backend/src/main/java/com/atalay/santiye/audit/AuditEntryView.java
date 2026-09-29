package com.atalay.santiye.audit;

import jakarta.annotation.Nullable;
import java.time.Instant;
import java.util.UUID;

/** Platform işlem geçmişinin bir satırı. */
public record AuditEntryView(UUID id, String action, @Nullable UUID companyId, @Nullable String companyName,
    String summary, @Nullable String actorName, Instant createdAt) {
}
