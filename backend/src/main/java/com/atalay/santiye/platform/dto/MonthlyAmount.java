package com.atalay.santiye.platform.dto;

import java.math.BigDecimal;

/** Bir ayın toplamı; month "2026-09" biçimindedir. */
public record MonthlyAmount(String month, BigDecimal amount) {
}
