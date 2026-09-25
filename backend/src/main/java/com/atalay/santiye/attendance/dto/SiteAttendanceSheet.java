package com.atalay.santiye.attendance.dto;

import java.util.List;
import java.util.UUID;

/**
 * Yoklama ekranında bir şantiye: personeli ve o günkü kaydı (alınmadıysa day.recordedAt boş). Ekran bütün aktif
 * şantiyelerin personelini tek listede gösterir; kullanıcı şantiye seçmez.
 */
public record SiteAttendanceSheet(UUID siteId, String siteName, List<WorkerView> workers, AttendanceDayView day) {
}
