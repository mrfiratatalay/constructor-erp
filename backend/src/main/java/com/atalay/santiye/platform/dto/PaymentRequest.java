package com.atalay.santiye.platform.dto;

import com.atalay.santiye.billing.PaymentMethod;
import jakarta.annotation.Nullable;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

/**
 * Elden ya da havaleyle alınan ödeme. Dönem verilmezse firmanın genel ödemesi olarak kaydedilir. Tutar tablodaki
 * sütunun (numeric(12,2)) sınırındadır: devasa sayı kayda ve işlem geçmişinin metnine hiç girmez.
 */
public record PaymentRequest(
    @NotNull @DecimalMin(value = "0.01") @Digits(integer = 10, fraction = 2) BigDecimal amount,
    @NotNull PaymentMethod method,
    @NotNull LocalDate paidOn,
    @Nullable @Size(max = 300) String description,
    @Nullable UUID subscriptionId) {
}
