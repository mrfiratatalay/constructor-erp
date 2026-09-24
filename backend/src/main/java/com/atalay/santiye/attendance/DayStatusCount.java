package com.atalay.santiye.attendance;

import java.time.LocalDate;
import java.util.UUID;

/** Sayım sorgularının satırı: bir şantiyede bir günde bir durumdan kaç kişi ("select new ..." ile dolar). */
public record DayStatusCount(UUID siteId, LocalDate day, AttendanceStatus status, Long count) {
}
