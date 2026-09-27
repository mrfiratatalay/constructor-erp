package com.atalay.santiye.puantaj;

import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;

/**
 * Bir kalemin ayı. Çalıştığı gün: geldiği günler artı yarım günlerin yarısı (yevmiye buna göre ödenir). Mesai
 * ayrı toplanır, saat olarak. İzinli gün gelmedi sayılmaz.
 */
record MonthTotals(BigDecimal workedDays, long halfDays, long absentDays, long leaveDays, BigDecimal overtime) {

    private static final BigDecimal HALF = new BigDecimal("0.5");

    static MonthTotals of(List<DayMark> marks) {
        long present = count(marks, DayStatus.PRESENT);
        long half = count(marks, DayStatus.HALF_DAY);
        BigDecimal worked = BigDecimal.valueOf(present).add(HALF.multiply(BigDecimal.valueOf(half)));
        BigDecimal overtime = marks.stream().map(DayMark::getOvertimeHours).filter(Objects::nonNull)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        return new MonthTotals(worked, half, count(marks, DayStatus.ABSENT), count(marks, DayStatus.LEAVE), overtime);
    }

    private static long count(List<DayMark> marks, DayStatus status) {
        return marks.stream().filter(mark -> mark.getStatus() == status).count();
    }
}
