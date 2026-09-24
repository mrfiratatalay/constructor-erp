package com.atalay.santiye.attendance;

import com.atalay.santiye.attendance.dto.AttendanceDayView;
import com.atalay.santiye.attendance.dto.SaveAttendanceRequest;
import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.common.error.ApiException;
import com.atalay.santiye.site.Site;
import com.atalay.santiye.site.SiteAccess;
import java.time.Clock;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Günlük yoklama. Şantiyeyi gören herkes (patron ve şefler) yoklama alır ve düzenler. Bir günün yoklaması
 * bir kez alınır; yanlışlık aynı yoklama düzenlenerek düzeltilir. İleri bir günün yoklaması alınmaz.
 * "Bugün" şantiyenin saatine göredir (app.timezone, ClockConfig).
 */
@Service
public class AttendanceService {

    private static final DateTimeFormatter DAY_NAME = DateTimeFormatter.ofPattern("d MMMM", Locale.forLanguageTag("tr"));

    private final AttendanceRepository attendances;
    private final AttendanceEntryRepository entries;
    private final AttendanceMarks marks;
    private final AttendanceViews views;
    private final SiteAccess siteAccess;
    private final Clock clock;

    AttendanceService(AttendanceRepository attendances, AttendanceEntryRepository entries, AttendanceMarks marks,
        AttendanceViews views, SiteAccess siteAccess, Clock clock) {
        this.attendances = attendances;
        this.entries = entries;
        this.marks = marks;
        this.views = views;
        this.siteAccess = siteAccess;
        this.clock = clock;
    }

    @Transactional(readOnly = true)
    public AttendanceDayView getDay(CurrentUser user, UUID siteId, LocalDate day) {
        Site site = siteAccess.requireVisible(user, siteId);
        return attendances.findBySiteIdAndDay(site.getId(), day)
            .map(views::of)
            .orElseGet(() -> views.empty(site.getId(), day));
    }

    @Transactional
    public AttendanceDayView createDay(CurrentUser user, UUID siteId, LocalDate day, SaveAttendanceRequest request) {
        Site site = siteAccess.requireVisible(user, siteId);
        if (day.isAfter(LocalDate.now(clock))) {
            throw ApiException.badRequest("İleri bir günün yoklaması alınamaz.");
        }
        if (attendances.existsBySiteIdAndDay(site.getId(), day)) {
            throw ApiException.conflict(DAY_NAME.format(day) + " yoklaması zaten alınmış.");
        }
        Attendance attendance = attendances.save(new Attendance(site, day, user.userId(), clock.instant()));
        entries.saveAll(marks.build(attendance, request.entries()));
        return views.of(attendance);
    }

    /** Liste önce doğrulanır, sonra günün eski listesi yenisiyle değiştirilir; kim, ne zaman düzenledi kalır. */
    @Transactional
    public AttendanceDayView updateDay(CurrentUser user, UUID siteId, LocalDate day, SaveAttendanceRequest request) {
        Site site = siteAccess.requireVisible(user, siteId);
        Attendance attendance = attendances.findBySiteIdAndDay(site.getId(), day)
            .orElseThrow(() -> ApiException.notFound(DAY_NAME.format(day) + " yoklaması alınmamış."));
        List<AttendanceEntry> rows = marks.build(attendance, request.entries());
        attendance.markEdited(user.userId(), clock.instant());
        entries.deleteByAttendance(attendance.getId());
        entries.saveAll(rows);
        return views.of(attendance);
    }
}
