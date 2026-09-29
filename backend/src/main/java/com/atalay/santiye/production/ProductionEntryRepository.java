package com.atalay.santiye.production;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

interface ProductionEntryRepository extends JpaRepository<ProductionEntry, UUID> {

    /** Bir satır bir imalat: girişlerinin toplamı, bugünkülerin toplamı ve son girişin zamanı. */
    interface ProgressRow {
        UUID getItemId();

        BigDecimal getDone();

        BigDecimal getToday();

        Instant getLastEntryAt();
    }

    @Query("select e.itemId as itemId, sum(e.quantity) as done, "
        + "sum(case when e.day = :today then e.quantity else 0 end) as today, max(e.createdAt) as lastEntryAt "
        + "from ProductionEntry e where e.siteId = :siteId and e.deletedAt is null group by e.itemId")
    List<ProgressRow> progressOf(UUID siteId, LocalDate today);

    List<ProductionEntry> findByItemIdAndDeletedAtIsNullOrderByDayDescCreatedAtDesc(UUID itemId);

    /** Şantiyenin son girişleri; silinmiş imalatın girişleri gelmez. */
    @Query("select e from ProductionEntry e, ProductionItem i where i.id = e.itemId and i.deletedAt is null "
        + "and e.siteId = :siteId and e.deletedAt is null order by e.createdAt desc")
    List<ProductionEntry> findRecent(UUID siteId, Pageable page);

    /** Excel'in "Günlük girişler" sayfası: silinmemiş imalatların bütün girişleri, günün sırasıyla. */
    @Query("select e from ProductionEntry e, ProductionItem i where i.id = e.itemId and i.deletedAt is null "
        + "and e.siteId = :siteId and e.deletedAt is null order by e.day, e.createdAt")
    List<ProductionEntry> findAllOfSite(UUID siteId);

    Optional<ProductionEntry> findByIdAndCompanyIdAndDeletedAtIsNull(UUID id, UUID companyId);

    boolean existsByItemIdAndDeletedAtIsNull(UUID itemId);
}
