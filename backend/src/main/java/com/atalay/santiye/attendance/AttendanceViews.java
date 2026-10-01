package com.atalay.santiye.attendance;

import com.atalay.santiye.attendance.dto.AttendanceCounts;
import com.atalay.santiye.attendance.dto.AttendanceDayView;
import com.atalay.santiye.attendance.dto.AttendanceEntryView;
import com.atalay.santiye.common.text.TurkishOrder;
import com.atalay.santiye.user.AppUser;
import com.atalay.santiye.user.UserRepository;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;

/** Günün yoklamasını ekranda okunacak biçime çevirir: kişiler Türkçe alfabe sırasıyla, sayılarıyla. */
@Component
class AttendanceViews {

    private static final AttendanceCounts NONE = new AttendanceCounts(0, 0, 0);

    private final AttendanceEntryRepository entries;
    private final SiteWorkerRepository workers;
    private final UserRepository users;

    AttendanceViews(AttendanceEntryRepository entries, SiteWorkerRepository workers, UserRepository users) {
        this.entries = entries;
        this.workers = workers;
        this.users = users;
    }

    /** O gün yoklama alınmamış: tarih var, kayıt yok. */
    AttendanceDayView empty(UUID siteId, LocalDate day) {
        return new AttendanceDayView(siteId, day, null, null, null, NONE, List.of());
    }

    AttendanceDayView of(Attendance attendance) {
        List<AttendanceEntry> rows = entries.findByAttendance(attendance.getId());
        Map<UUID, SiteWorker> byId = workers.findAllById(rows.stream().map(row -> row.getId().workerId()).toList())
            .stream().collect(Collectors.toMap(SiteWorker::getId, Function.identity()));
        List<AttendanceEntryView> people = rows.stream()
            .map(row -> toView(row, byId.get(row.getId().workerId())))
            .sorted(Comparator.comparing(view -> view.worker().fullName(), TurkishOrder.NAMES))
            .toList();
        String takenBy = users.findById(attendance.getTakenBy()).map(AppUser::getFullName).orElse(null);
        AttendanceCounts counts = Tally.of(rows.stream().map(AttendanceEntry::getStatus).toList());
        return new AttendanceDayView(attendance.getSiteId(), attendance.getDay(), attendance.getCreatedAt(), takenBy,
            attendance.getUpdatedAt(), counts, people);
    }

    private static AttendanceEntryView toView(AttendanceEntry row, SiteWorker worker) {
        return new AttendanceEntryView(SiteWorkers.toView(worker), row.getStatus(), row.getReason(), row.getNote());
    }
}
