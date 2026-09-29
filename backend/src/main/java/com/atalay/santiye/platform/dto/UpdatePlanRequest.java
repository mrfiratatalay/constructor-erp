package com.atalay.santiye.platform.dto;

import com.atalay.santiye.billing.PlanStatus;
import jakarta.annotation.Nullable;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.util.List;

/** Paket koşulları. Fiyat değişikliği yalnızca yeni dönemlere yansır; açık dönemler kendi fiyatını korur. */
public record UpdatePlanRequest(
    @NotBlank @Size(max = 60) String name,
    @Nullable @Size(max = 160) String tagline,
    @Nullable @DecimalMin("0") BigDecimal monthlyPrice,
    @Nullable @Min(1) Integer maxUsers,
    @Nullable @Min(1) Integer maxSites,
    boolean highlighted,
    boolean visible,
    @NotNull PlanStatus status,
    @NotNull List<String> features) {
}
