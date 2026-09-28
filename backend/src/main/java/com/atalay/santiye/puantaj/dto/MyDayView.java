package com.atalay.santiye.puantaj.dto;

import com.atalay.santiye.puantaj.DayStatus;
import jakarta.annotation.Nullable;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

/**
 * Çalışanın kendi bir günü. Şefin notu yazılmaz: not şefle patron arasındadır. İşaretleyenin adı ve numarası
 * yazılır: kaydı yanlış bulan çalışan o gün, yazan kişiyi arar.
 */
public record MyDayView(
    LocalDate day,
    DayStatus status,
    @Nullable BigDecimal overtimeHours,
    String markedByName,
    @Nullable String markedByPhone,
    Instant markedAt) {
}
