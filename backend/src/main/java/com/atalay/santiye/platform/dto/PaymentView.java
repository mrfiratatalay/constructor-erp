package com.atalay.santiye.platform.dto;

import jakarta.annotation.Nullable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record PaymentView(UUID id, @Nullable UUID subscriptionId, BigDecimal amount, String currency, String method,
    LocalDate paidOn, @Nullable String description, @Nullable String createdByName) {
}
