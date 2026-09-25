package com.atalay.santiye.attendance;

import com.atalay.santiye.attendance.dto.SiteAttendanceOverview;
import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.common.persistence.SiteCount;
import com.atalay.santiye.site.Site;
import com.atalay.santiye.site.SiteAccess;
import java.time.Clock;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Yoklama ana sayfası: görülen her şantiye için personel sayısı, BUGÜNÜN sayıları ve son yoklama günü.
 * Ay toplamı ("bu ay 230 geldi") burada gösterilmez: adam-gün sayısı sahada anlamsızdır; ay, şantiyenin
 * geçmişinde seçilir. Üç sayım da tek sorguda, bütün şantiyeler için birlikte yapılır.
 */
@Service
public class AttendanceOverview {

    private final AttendanceRepository attendances;
    private final SiteWorkerRepository workers;
    private final SiteAccess siteAccess;
    private final Clock clock;

    AttendanceOverview(AttendanceRepository attendances, SiteWorkerRepository workers, SiteAccess siteAccess,
        Clock clock) {
        this.attendances = attendances;
        this.workers = workers;
        this.siteAccess = siteAccess;
        this.clock = clock;
    }

    /** Bütün şantiyeler için bir kerede toplanan sayımlar, şantiye kimliğine göre. */
    private record Counts(Map<UUID, Long> workers, Map<UUID, LocalDate> lastDays,
        Map<UUID, Map<AttendanceStatus, Long>> today) {
    }

    @Transactional(readOnly = true)
    public List<SiteAttendanceOverview> overview(CurrentUser user) {
        List<Site> sites = siteAccess.visibleSites(user);
        if (sites.isEmpty()) {
            return List.of();
        }
        Counts counts = countsFor(sites.stream().map(Site::getId).toList());
        return sites.stream().map(site -> toView(site, counts)).toList();
    }

    private Counts countsFor(List<UUID> siteIds) {
        LocalDate today = LocalDate.now(clock);
        Map<UUID, Long> workerCounts = workers.countBySite(siteIds).stream()
            .collect(Collectors.toMap(SiteCount::siteId, SiteCount::count));
        Map<UUID, LocalDate> lastDays = attendances.findLastDays(siteIds).stream()
            .collect(Collectors.toMap(SiteDay::siteId, SiteDay::day));
        Map<UUID, Map<AttendanceStatus, Long>> todays = attendances.countByDay(siteIds, today, today).stream()
            .collect(Collectors.groupingBy(DayStatusCount::siteId, AttendanceHistory.countsByStatus()));
        return new Counts(workerCounts, lastDays, todays);
    }

    private static SiteAttendanceOverview toView(Site site, Counts counts) {
        UUID id = site.getId();
        Map<AttendanceStatus, Long> today = counts.today().get(id);
        return new SiteAttendanceOverview(id, site.getName(), counts.workers().getOrDefault(id, 0L).intValue(),
            counts.lastDays().get(id), today == null ? null : Tally.ofCounts(today));
    }
}
