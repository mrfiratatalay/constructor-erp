package com.atalay.santiye.account.dto;

import com.atalay.santiye.billing.dto.PlanFeatureView;
import jakarta.annotation.Nullable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * Patronun gördüğü abonelik: paket, bugünkü dönem, kalan gün, kullanım (kişi, şantiye / paket sınırı), paketteki
 * modüller, geçmiş dönemler ve ödemeler. Değiştirmek Constructor ERP ekibinin işidir (POS yok).
 */
public record CompanySubscriptionView(
    @Nullable String planName,
    @Nullable String state,
    @Nullable LocalDate startsOn,
    @Nullable LocalDate endsOn,
    @Nullable Long daysLeft,
    @Nullable BigDecimal monthlyPrice,
    long activeUsers,
    @Nullable Integer maxUsers,
    long activeSites,
    @Nullable Integer maxSites,
    List<PlanFeatureView> features,
    List<PeriodView> periods,
    List<CompanyPaymentView> payments) {
}
