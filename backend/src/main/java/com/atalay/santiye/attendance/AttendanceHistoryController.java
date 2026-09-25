package com.atalay.santiye.attendance;

import com.atalay.santiye.attendance.dto.AttendanceDaySummary;
import com.atalay.santiye.attendance.dto.SiteAttendanceMonth;
import com.atalay.santiye.attendance.dto.SiteAttendanceOverview;
import com.atalay.santiye.attendance.dto.WorkerAttendanceMonth;
import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.common.error.ApiException;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.time.YearMonth;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.UUID;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/** Yoklama geçmişi: son günler, genel bakış, şantiyenin ayı, personelin ayı. Ay "2026-09" biçimindedir. */
@RestController
@Tag(name = "Attendance")
public class AttendanceHistoryController {

    private final AttendanceHistory history;
    private final AttendanceOverview overview;

    AttendanceHistoryController(AttendanceHistory history, AttendanceOverview overview) {
        this.history = history;
        this.overview = overview;
    }

    /** Yoklama ekranının "Geçmiş"i: bütün şantiyelerin son günleri, gün gün toplam (bugün hariç). */
    @GetMapping("/attendance/days")
    public List<AttendanceDaySummary> getRecentAttendanceDays(@AuthenticationPrincipal CurrentUser user) {
        return history.recentDays(user);
    }

    @GetMapping("/attendance/overview")
    public List<SiteAttendanceOverview> getAttendanceOverview(@AuthenticationPrincipal CurrentUser user) {
        return overview.overview(user);
    }

    @GetMapping("/sites/{siteId}/attendance")
    public SiteAttendanceMonth getSiteAttendanceMonth(@AuthenticationPrincipal CurrentUser user,
        @PathVariable UUID siteId, @RequestParam String month) {
        return history.siteMonth(user, siteId, monthOf(month));
    }

    @GetMapping("/workers/{workerId}/attendance")
    public WorkerAttendanceMonth getWorkerAttendanceMonth(@AuthenticationPrincipal CurrentUser user,
        @PathVariable UUID workerId, @RequestParam String month) {
        return history.workerMonth(user, workerId, monthOf(month));
    }

    /** Ay düz metin olarak alınır ki API dokümanında da "2026-09" diye görünsün. */
    private static YearMonth monthOf(String month) {
        try {
            return YearMonth.parse(month);
        } catch (DateTimeParseException invalid) {
            throw ApiException.badRequest("Ay 2026-09 biçiminde olmalı.");
        }
    }
}
