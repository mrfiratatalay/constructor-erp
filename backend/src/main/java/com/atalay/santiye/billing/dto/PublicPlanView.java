package com.atalay.santiye.billing.dto;

import jakarta.annotation.Nullable;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

/** Tanıtım sitesindeki paket kartı. monthlyPrice boşsa "Teklif alın"; sınır boşsa sınırsız. */
public record PublicPlanView(UUID id, String code, String name, @Nullable String tagline,
    @Nullable BigDecimal monthlyPrice, String currency, @Nullable Integer maxUsers, @Nullable Integer maxSites,
    boolean highlighted, List<PlanFeatureView> features) {
}
