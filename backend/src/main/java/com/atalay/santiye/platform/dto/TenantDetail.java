package com.atalay.santiye.platform.dto;

import jakarta.annotation.Nullable;
import java.util.List;

/** Firma ayrıntısı: kimlik, bugünkü durum (liste satırı), bütün abonelik dönemleri ve ödemeler. */
public record TenantDetail(
    TenantRow summary,
    @Nullable String phone,
    @Nullable String email,
    @Nullable String logoUrl,
    @Nullable String lockReason,
    @Nullable String currentSubscriptionId,
    List<SubscriptionView> subscriptions,
    List<PaymentView> payments) {
}
