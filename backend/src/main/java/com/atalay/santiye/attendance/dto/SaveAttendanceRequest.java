package com.atalay.santiye.attendance.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

/** Günün bütün listesi tek seferde gönderilir: herkes varsayılan "Geldi", yalnızca gelmeyenler değişir. */
public record SaveAttendanceRequest(@NotEmpty List<@Valid AttendanceEntryRequest> entries) {
}
