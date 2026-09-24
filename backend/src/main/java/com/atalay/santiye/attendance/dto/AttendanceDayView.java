package com.atalay.santiye.attendance.dto;

import jakarta.annotation.Nullable;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

/**
 * Bir şantiyenin bir günlük yoklaması. recordedAt boşsa o gün yoklama alınmamıştır (entries boş);
 * doluysa kim aldı, en son ne zaman düzenlendi ve kişi kişi durum.
 */
public record AttendanceDayView(
    UUID siteId,
    LocalDate day,
    @Nullable Instant recordedAt,
    @Nullable String recordedByName,
    @Nullable Instant updatedAt,
    AttendanceCounts counts,
    List<AttendanceEntryView> entries) {
}
