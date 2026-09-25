package com.atalay.santiye.attendance;

import com.atalay.santiye.attendance.dto.AttendanceDayView;
import com.atalay.santiye.attendance.dto.SaveAttendanceRequest;
import com.atalay.santiye.attendance.dto.SaveDailyAttendanceRequest;
import com.atalay.santiye.attendance.dto.SiteAttendanceSheet;
import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.site.Site;
import com.atalay.santiye.site.SiteAccess;
import com.atalay.santiye.site.SiteStatus;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Yoklama ekranı: firmanın bütün aktif şantiyelerinin bir günü, tek listede. Kullanıcı şantiye seçmez; veri yine
 * şantiye şantiye durur (her şantiyenin kendi yoklaması), kaydederken her şantiyeninki ayrı ayrı alınır ya da
 * düzenlenir. Aynı liste ekranın "Geçmiş"inde bir günü açınca da kullanılır.
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
            .map(site -> sheetOf(user, site, day))
            .flatMap(Optional::stream)
            .toList();
    }

    /**
     * Aktif şantiye her zaman gelir. Tamamlanan şantiyede artık yoklama alınmaz; o gün yoklaması alınmışsa yine
     * gelir ki geçmişteki bir gün açıldığında sayısı ile listesi tutsun.
     */
    private Optional<SiteAttendanceSheet> sheetOf(CurrentUser user, Site site, LocalDate day) {
        AttendanceDayView recorded = attendance.getDay(user, site.getId(), day);
        if (site.getStatus() != SiteStatus.ACTIVE && recorded.recordedAt() == null) {
            return Optional.empty();
        }
        return Optional.of(new SiteAttendanceSheet(site.getId(), site.getName(), workers.listWorkers(user, site.getId()),
            recorded));
    }

    /** Hepsi ya da hiçbiri: bir şantiyenin listesi hatalıysa hiçbir şantiyeninki yazılmaz. */
    @Transactional
    public List<SiteAttendanceSheet> save(CurrentUser user, LocalDate day, SaveDailyAttendanceRequest request) {
        request.sites().forEach(site ->
            attendance.saveDay(user, site.siteId(), day, new SaveAttendanceRequest(site.entries())));
        return sheets(user, day);
    }
}
