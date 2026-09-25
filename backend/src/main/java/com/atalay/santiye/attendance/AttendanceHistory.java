package com.atalay.santiye.attendance;

import com.atalay.santiye.attendance.dto.AttendanceCounts;
import com.atalay.santiye.attendance.dto.AttendanceDaySummary;
import com.atalay.santiye.attendance.dto.SiteAttendanceMonth;
import com.atalay.santiye.attendance.dto.WorkerAttendanceDay;
import com.atalay.santiye.attendance.dto.WorkerAttendanceMonth;
import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.common.error.ApiException;
import com.atalay.santiye.site.Site;
import com.atalay.santiye.site.SiteAccess;
import java.time.Clock;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.UUID;
import java.util.stream.Collector;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Yoklama geçmişi: Yoklama ekranının son günleri (bütün şantiyeler), bir şantiyenin ayı, bir personelin ayı.
 * Yalnızca yoklama alınmış günler görünür; en yeni gün üstte. Sayımlar veritabanında yapılır.
 */
@Service
public class AttendanceHistory {

    /** Yoklama ekranının "Geçmiş"i bu kadar geriye bakar: "son günlerde durum ne?" sorusu için yeterli. */
    private static final int RECENT_DAYS = 14;

    private final AttendanceRepository attendances;
    private final SiteWorkerRepository workers;
    private final SiteAccess siteAccess;
    private final Clock clock;

    AttendanceHistory(AttendanceRepository attendances, SiteWorkerRepository workers, SiteAccess siteAccess,
        Clock clock) {
        this.attendances = attendances;
        this.workers = workers;
        this.siteAccess = siteAccess;
        this.clock = clock;
    }

    /** Bütün şantiyelerin son iki haftası, gün gün toplam; bugün hariç (bugün ekranın üstündedir). */
    @Transactional(readOnly = true)
    public List<AttendanceDaySummary> recentDays(CurrentUser user) {
        List<UUID> siteIds = siteAccess.visibleSites(user).stream().map(Site::getId).toList();
        if (siteIds.isEmpty()) {
            return List.of();
        }
        LocalDate today = LocalDate.now(clock);
        return summaries(attendances.countByDay(siteIds, today.minusDays(RECENT_DAYS), today.minusDays(1)));
    }

    @Transactional(readOnly = true)
    public SiteAttendanceMonth siteMonth(CurrentUser user, UUID siteId, YearMonth month) {
        Site site = siteAccess.requireVisible(user, siteId);
        List<DayStatusCount> rows = attendances.countByDay(List.of(site.getId()), month.atDay(1), month.atEndOfMonth());
        List<AttendanceDaySummary> days = summaries(rows);
        AttendanceCounts totals = Tally.ofCounts(rows.stream().collect(countsByStatus()));
        int workerCount = workers.findBySiteIdOrderByFullName(site.getId()).size();
        return new SiteAttendanceMonth(site.getId(), month.toString(), workerCount, totals, days);
    }

    @Transactional(readOnly = true)
    public WorkerAttendanceMonth workerMonth(CurrentUser user, UUID workerId, YearMonth month) {
        SiteWorker worker = workers.findById(workerId)
            .orElseThrow(() -> ApiException.notFound("Personel bulunamadı."));
        siteAccess.requireVisible(user, worker.getSiteId());
        List<WorkerDayMark> marks = attendances.findWorkerDays(workerId, month.atDay(1), month.atEndOfMonth());
        List<WorkerAttendanceDay> days = marks.stream()
            .map(mark -> new WorkerAttendanceDay(mark.day(), mark.status(), mark.reason(), mark.note()))
            .toList();
        AttendanceCounts counts = Tally.of(marks.stream().map(WorkerDayMark::status).toList());
        return new WorkerAttendanceMonth(SiteWorkers.toView(worker), worker.getSiteId(), month.toString(), counts, days);
    }

    /** Gün gün toplam, en yeni gün üstte; aynı günün farklı şantiyelerdeki sayıları birleşir. */
    private static List<AttendanceDaySummary> summaries(List<DayStatusCount> rows) {
        Map<LocalDate, Map<AttendanceStatus, Long>> byDay = rows.stream().collect(Collectors.groupingBy(
            DayStatusCount::day, () -> new TreeMap<>(Comparator.reverseOrder()), countsByStatus()));
        return byDay.entrySet().stream()
            .map(entry -> new AttendanceDaySummary(entry.getKey(), Tally.ofCounts(entry.getValue())))
            .toList();
    }

    /** Satırları durum başına toplar: aynı durumun farklı günlerdeki sayıları birleşir. */
    static Collector<DayStatusCount, ?, Map<AttendanceStatus, Long>> countsByStatus() {
        return Collectors.groupingBy(DayStatusCount::status, Collectors.summingLong(DayStatusCount::count));
    }
}
