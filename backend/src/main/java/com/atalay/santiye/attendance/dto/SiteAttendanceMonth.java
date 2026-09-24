package com.atalay.santiye.attendance.dto;

import java.util.List;
import java.util.UUID;

/** Bir şantiyenin bir ayı ("2026-09"): yoklama alınan günler, en yeni üstte; totals: ayın toplamı. */
public record SiteAttendanceMonth(
    UUID siteId,
    String month,
    int workerCount,
    AttendanceCounts totals,
    List<AttendanceDaySummary> days) {
}
