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
 * Yoklama geçmişi, ay ay: bir şantiyenin hangi gün kaç kişisi geldi, bir personelin hangi gün geldiği ya da
 * neden gelmediği. Yalnızca yoklama alınmış günler görünür; en yeni gün üstte. Sayımlar veritabanında yapılır.
 */
@Service
public class AttendanceHistory {

    private final AttendanceRepository attendances;
    private final SiteWorkerRepository workers;
    private final SiteAccess siteAccess;

    AttendanceHistory(AttendanceRepository attendances, SiteWorkerRepository workers, SiteAccess siteAccess) {
        this.attendances = attendances;
        this.workers = workers;
        this.siteAccess = siteAccess;
    }

    @Transactional(readOnly = true)
    public SiteAttendanceMonth siteMonth(CurrentUser user, UUID siteId, YearMonth month) {
        Site site = siteAccess.requireVisible(user, siteId);
        List<DayStatusCount> rows = attendances.countByDay(List.of(site.getId()), month.atDay(1), month.atEndOfMonth());
        Map<LocalDate, Map<AttendanceStatus, Long>> byDay = rows.stream().collect(Collectors.groupingBy(
            DayStatusCount::day, () -> new TreeMap<>(Comparator.reverseOrder()), countsByStatus()));
        List<AttendanceDaySummary> days = byDay.entrySet().stream()
            .map(entry -> new AttendanceDaySummary(entry.getKey(), Tally.ofCounts(entry.getValue())))
            .toList();
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

    /** Satırları durum başına toplar: aynı durumun farklı günlerdeki sayıları birleşir. */
    static Collector<DayStatusCount, ?, Map<AttendanceStatus, Long>> countsByStatus() {
        return Collectors.groupingBy(DayStatusCount::status, Collectors.summingLong(DayStatusCount::count));
    }
}
