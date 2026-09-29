package com.atalay.santiye.account.dto;

import jakarta.annotation.Nullable;
import java.math.BigDecimal;
import java.time.LocalDate;

public record PeriodView(String planName, String state, LocalDate startsOn, LocalDate endsOn,
    @Nullable BigDecimal monthlyPrice) {
}
