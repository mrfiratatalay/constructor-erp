package com.atalay.santiye.attendance;

import com.atalay.santiye.attendance.dto.AttendanceCounts;
import java.util.Collection;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

/** Geldi / gelmedi / izinli sayıları: tek tek durumlardan ya da gruplanmış sayımlardan. */
final class Tally {

    private Tally() {
    }

    static AttendanceCounts of(Collection<AttendanceStatus> statuses) {
        return ofCounts(statuses.stream().collect(Collectors.groupingBy(Function.identity(), Collectors.counting())));
    }

    /** Veritabanında gruplanmış sayımlardan (durum → kişi sayısı). */
    static AttendanceCounts ofCounts(Map<AttendanceStatus, Long> byStatus) {
        return new AttendanceCounts(count(byStatus, AttendanceStatus.PRESENT), count(byStatus, AttendanceStatus.ABSENT),
            count(byStatus, AttendanceStatus.EXCUSED));
    }

    private static int count(Map<AttendanceStatus, Long> byStatus, AttendanceStatus status) {
        return byStatus.getOrDefault(status, 0L).intValue();
    }
}
