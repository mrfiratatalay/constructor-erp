package com.atalay.santiye.attendance;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

interface AttendanceRepository extends JpaRepository<Attendance, UUID> {

    Optional<Attendance> findBySiteIdAndDay(UUID siteId, LocalDate day);

    boolean existsBySiteIdAndDay(UUID siteId, LocalDate day);

    /** Verilen şantiyelerde, verilen tarih aralığında gün ve durum başına kişi sayısı. */
    @Query("""
        select new com.atalay.santiye.attendance.DayStatusCount(a.siteId, a.day, e.status, count(e))
        from Attendance a, AttendanceEntry e
        where e.id.attendanceId = a.id and a.siteId in :siteIds and a.day between :from and :to
        group by a.siteId, a.day, e.status""")
    List<DayStatusCount> countByDay(Collection<UUID> siteIds, LocalDate from, LocalDate to);

    @Query("""
        select new com.atalay.santiye.attendance.WorkerDayMark(a.day, e.status, e.reason, e.note)
        from Attendance a, AttendanceEntry e
        where e.id.attendanceId = a.id and e.id.workerId = :workerId and a.day between :from and :to
        order by a.day desc""")
    List<WorkerDayMark> findWorkerDays(UUID workerId, LocalDate from, LocalDate to);

    /** Şantiye başına son yoklama günü (ana sayfadaki "Son yoklama: 23 Eylül"). */
    @Query("select new com.atalay.santiye.attendance.SiteDay(a.siteId, max(a.day)) from Attendance a "
        + "where a.siteId in :siteIds group by a.siteId")
    List<SiteDay> findLastDays(Collection<UUID> siteIds);
}
