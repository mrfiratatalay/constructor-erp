package com.atalay.santiye.attendance;

import com.atalay.santiye.attendance.dto.AttendanceDayView;
import com.atalay.santiye.attendance.dto.SaveAttendanceRequest;
import com.atalay.santiye.auth.CurrentUser;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.UUID;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/** Bir şantiyenin bir günlük yoklaması: gün adreste ("2026-09-25"), kişi kişi liste gövdede. */
@RestController
@Tag(name = "Attendance")
public class AttendanceController {

    private final AttendanceService attendance;

    AttendanceController(AttendanceService attendance) {
        this.attendance = attendance;
    }

    @GetMapping("/sites/{siteId}/attendance/{day}")
    public AttendanceDayView getAttendanceDay(@AuthenticationPrincipal CurrentUser user, @PathVariable UUID siteId,
        @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate day) {
        return attendance.getDay(user, siteId, day);
    }

    @PostMapping("/sites/{siteId}/attendance/{day}")
    @ResponseStatus(HttpStatus.CREATED)
    public AttendanceDayView createAttendanceDay(@AuthenticationPrincipal CurrentUser user, @PathVariable UUID siteId,
        @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate day,
        @Valid @RequestBody SaveAttendanceRequest request) {
        return attendance.createDay(user, siteId, day, request);
    }

    @PutMapping("/sites/{siteId}/attendance/{day}")
    public AttendanceDayView updateAttendanceDay(@AuthenticationPrincipal CurrentUser user, @PathVariable UUID siteId,
        @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate day,
        @Valid @RequestBody SaveAttendanceRequest request) {
        return attendance.updateDay(user, siteId, day, request);
    }
}
