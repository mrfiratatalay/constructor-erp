package com.atalay.santiye.account.dto;

import jakarta.annotation.Nullable;
import java.math.BigDecimal;
import java.time.LocalDate;

public record CompanyPaymentView(BigDecimal amount, String currency, String method, LocalDate paidOn,
    @Nullable String description) {
}
