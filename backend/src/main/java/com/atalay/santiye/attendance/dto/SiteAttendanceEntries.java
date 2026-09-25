package com.atalay.santiye.attendance.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

/** Bir şantiyenin o günkü bütün listesi (SaveAttendanceRequest'in aynısı, şantiyesiyle birlikte). */
public record SiteAttendanceEntries(@NotNull UUID siteId, @NotEmpty List<@Valid AttendanceEntryRequest> entries) {
}
