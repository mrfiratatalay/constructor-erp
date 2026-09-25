package com.atalay.santiye.attendance;

import com.atalay.santiye.attendance.dto.SaveDailyAttendanceRequest;
import com.atalay.santiye.attendance.dto.SiteAttendanceSheet;
import com.atalay.santiye.auth.CurrentUser;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/** Yoklama ekranı: bütün aktif şantiyelerin bir günü ("2026-09-25"), tek listede okunur, tek seferde kaydedilir. */
@RestController
@Tag(name = "Attendance")
public class DailyAttendanceController {

    private final DailyAttendance daily;

    DailyAttendanceController(DailyAttendance daily) {
        this.daily = daily;
    }

    @GetMapping("/attendance/days/{day}")
    public List<SiteAttendanceSheet> getDailyAttendance(@AuthenticationPrincipal CurrentUser user,
        @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate day) {
        return daily.sheets(user, day);
    }

    @PutMapping("/attendance/days/{day}")
    public List<SiteAttendanceSheet> saveDailyAttendance(@AuthenticationPrincipal CurrentUser user,
        @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate day,
        @Valid @RequestBody SaveDailyAttendanceRequest request) {
        return daily.save(user, day, request);
    }
}
