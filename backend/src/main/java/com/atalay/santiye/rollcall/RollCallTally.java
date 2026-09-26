package com.atalay.santiye.rollcall;

import com.atalay.santiye.attendance.AttendanceStatus;
import com.atalay.santiye.rollcall.dto.DayRecord;
import com.atalay.santiye.rollcall.dto.RollCallCounts;
import java.util.List;

/** Geldi · gelmedi · izinli · katılmadı sayımı. Boş kayıt "katılmadı"dır: gün listesinde de kişinin ayında da. */
final class RollCallTally {

    private RollCallTally() {
    }

    static RollCallCounts of(List<DayRecord> records) {
        return new RollCallCounts(
            count(records, AttendanceStatus.PRESENT),
            count(records, AttendanceStatus.ABSENT),
            count(records, AttendanceStatus.EXCUSED),
            records.stream().filter(record -> record == null).count());
    }

    private static long count(List<DayRecord> records, AttendanceStatus status) {
        return records.stream().filter(record -> record != null && record.status() == status).count();
    }
}
