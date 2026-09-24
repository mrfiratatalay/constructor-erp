package com.atalay.santiye.attendance;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

interface AttendanceEntryRepository extends JpaRepository<AttendanceEntry, AttendanceEntryId> {

    @Query("select e from AttendanceEntry e where e.id.attendanceId = :attendanceId")
    List<AttendanceEntry> findByAttendance(UUID attendanceId);

    /** Düzenlemede günün listesi baştan yazılır: eskisi silinir, yenisi kaydedilir. */
    @Modifying(flushAutomatically = true)
    @Query("delete from AttendanceEntry e where e.id.attendanceId = :attendanceId")
    void deleteByAttendance(UUID attendanceId);
}
