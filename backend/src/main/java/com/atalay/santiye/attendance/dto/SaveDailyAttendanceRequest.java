package com.atalay.santiye.attendance.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

/**
 * Yoklama ekranının "Yoklamayı Kaydet"i: birden çok şantiyenin listesi tek seferde. Ekran yalnızca henüz alınmamış
 * ya da bu ekranda değiştirilmiş şantiyeleri gönderir.
 */
public record SaveDailyAttendanceRequest(@NotEmpty List<@Valid SiteAttendanceEntries> sites) {
}
