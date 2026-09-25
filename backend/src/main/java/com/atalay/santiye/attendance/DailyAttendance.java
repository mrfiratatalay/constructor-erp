package com.atalay.santiye.attendance;

import com.atalay.santiye.attendance.dto.SiteAttendanceSheet;
import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.site.SiteAccess;
import com.atalay.santiye.site.SiteStatus;
import java.time.LocalDate;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Yoklama ekranı: firmanın bütün aktif şantiyelerinin bir günü, tek listede. Kullanıcı şantiye seçmez; veri yine
 * şantiye şantiye durur (her şantiyenin kendi yoklaması). Tamamlanan şantiyeler ekrana gelmez: orada artık
 * yoklama alınmaz.
 */
@Service
public class DailyAttendance {

    private final SiteAccess siteAccess;
    private final SiteWorkers workers;
    private final AttendanceService attendance;

    DailyAttendance(SiteAccess siteAccess, SiteWorkers workers, AttendanceService attendance) {
        this.siteAccess = siteAccess;
        this.workers = workers;
        this.attendance = attendance;
    }

    @Transactional(readOnly = true)
    public List<SiteAttendanceSheet> sheets(CurrentUser user, LocalDate day) {
        return siteAccess.visibleSites(user).stream()
            .filter(site -> site.getStatus() == SiteStatus.ACTIVE)
            .map(site -> new SiteAttendanceSheet(site.getId(), site.getName(), workers.listWorkers(user, site.getId()),
                attendance.getDay(user, site.getId(), day)))
            .toList();
    }
}
