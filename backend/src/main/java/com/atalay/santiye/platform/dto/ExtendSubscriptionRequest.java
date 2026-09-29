package com.atalay.santiye.platform.dto;

import jakarta.annotation.Nullable;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.util.UUID;

/** Aboneliği başlat ya da uzat: yeni dönem. Ödeme de alındıysa aynı işlemde bu döneme kaydedilir. */
public record ExtendSubscriptionRequest(
    @NotNull UUID planId,
    @Min(1) @Max(36) int months,
    @Nullable LocalDate startsOn,
    @Nullable @Size(max = 300) String note,
    @Nullable @Valid PaymentRequest payment) {
}
