package com.atalay.santiye.attendance;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

interface AttendanceRepository extends JpaRepository<Attendance, UUID> {

    Optional<Attendance> findBySiteIdAndDay(UUID siteId, LocalDate day);

    boolean existsBySiteIdAndDay(UUID siteId, LocalDate day);
}
