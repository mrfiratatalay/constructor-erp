package com.atalay.santiye.rollcall;

import java.time.LocalDate;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

interface MemberAttendanceRepository extends JpaRepository<MemberAttendance, MemberDay> {

    /** Yoklama mesajının altındaki "N kişi katıldı": o gün o şantiyede kendisi katılıp hâlâ geldi sayılanlar. */
    @Query("select count(m) from MemberAttendance m where m.siteId = :siteId and m.id.day = :day "
        + "and m.checkedInAt is not null and m.status = com.atalay.santiye.attendance.AttendanceStatus.PRESENT")
    long countCheckedIn(UUID siteId, LocalDate day);
}
