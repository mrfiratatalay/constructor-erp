package com.atalay.santiye.attendance.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import java.util.List;

/**
 * Günün bütün listesi tek seferde gönderilir: herkes varsayılan "Geldi", yalnızca gelmeyenler değişir. Bir şantiyenin
 * günlük listesi binden uzun olmaz; sınır, tek istekle sunucuya on binlerce satır doğrulatılmasını önler.
 */
public record SaveAttendanceRequest(@NotEmpty @Size(max = 1000) List<@Valid AttendanceEntryRequest> entries) {
}
