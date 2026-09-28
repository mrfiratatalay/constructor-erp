package com.atalay.santiye.puantaj;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

interface DayMarkRepository extends JpaRepository<DayMark, MarkKey> {

    List<DayMark> findByCompanyIdAndIdDayBetween(UUID companyId, LocalDate from, LocalDate to);

    List<DayMark> findByIdEntryIdAndIdDayBetweenOrderByIdDay(UUID entryId, LocalDate from, LocalDate to);
}
