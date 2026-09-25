package com.atalay.santiye.attendance.dto;

import jakarta.annotation.Nullable;
import java.time.LocalDate;
import java.util.UUID;

/**
 * Yoklama ana sayfasında bir şantiye. today: bugünün sayıları (yoklama alınmadıysa yok);
 * lastDay: en son yoklama günü (hiç alınmadıysa yok).
 */
public record SiteAttendanceOverview(
    UUID siteId,
    String siteName,
    int workerCount,
    @Nullable LocalDate lastDay,
    @Nullable AttendanceCounts today) {
}
