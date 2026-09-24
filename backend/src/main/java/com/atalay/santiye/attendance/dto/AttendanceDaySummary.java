package com.atalay.santiye.attendance.dto;

import java.time.LocalDate;

/** Şantiye geçmişinde bir gün: "25 Eylül · 10 geldi · 2 gelmedi · 0 izinli". */
public record AttendanceDaySummary(LocalDate day, AttendanceCounts counts) {
}
