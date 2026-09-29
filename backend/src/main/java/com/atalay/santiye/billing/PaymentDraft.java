package com.atalay.santiye.billing;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

/** Kaydedilecek ödeme. subscriptionId boş olabilir (dönemden bağımsız ödeme). */
public record PaymentDraft(UUID subscriptionId, BigDecimal amount, PaymentMethod method, LocalDate paidOn,
    String description) {
}
