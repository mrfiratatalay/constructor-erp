package com.atalay.santiye.attendance;

import com.atalay.santiye.attendance.dto.AttendanceCounts;
import java.util.Collection;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

/** Durum listesinden geldi / gelmedi / izinli sayıları. */
final class Tally {

    private Tally() {
    }

    static AttendanceCounts of(Collection<AttendanceStatus> statuses) {
        Map<AttendanceStatus, Long> byStatus = statuses.stream()
            .collect(Collectors.groupingBy(Function.identity(), Collectors.counting()));
        return new AttendanceCounts(count(byStatus, AttendanceStatus.PRESENT), count(byStatus, AttendanceStatus.ABSENT),
            count(byStatus, AttendanceStatus.EXCUSED));
    }

    private static int count(Map<AttendanceStatus, Long> byStatus, AttendanceStatus status) {
        return byStatus.getOrDefault(status, 0L).intValue();
    }
}
