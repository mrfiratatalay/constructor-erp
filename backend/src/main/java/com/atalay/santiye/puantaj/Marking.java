package com.atalay.santiye.puantaj;

import java.math.BigDecimal;

/** Kurallardan geçmiş bir işaret (MarkRules): durum, varsa mesai saati ve not. */
record Marking(DayStatus status, BigDecimal overtimeHours, String note) {
}
