package com.atalay.santiye.attendance;

import java.time.LocalDate;

/** Personel geçmişinin satırı: o gün ne işaretlendi ("select new ..." ile dolar). */
public record WorkerDayMark(LocalDate day, AttendanceStatus status, AbsenceReason reason, String note) {
}
