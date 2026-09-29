package com.atalay.santiye.platform.dto;

import jakarta.annotation.Nullable;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

/** Platform yönetiminde paket: koşulları, açtığı modüller ve bugün bu pakette açık olan firma sayısı. */
public record PlanAdminView(UUID id, String code, String name, @Nullable String tagline,
    @Nullable BigDecimal monthlyPrice, String currency, @Nullable Integer maxUsers, @Nullable Integer maxSites,
    boolean highlighted, boolean visible, String status, List<String> features, long activeTenants) {
}
