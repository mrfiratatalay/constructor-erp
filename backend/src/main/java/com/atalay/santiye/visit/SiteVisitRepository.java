package com.atalay.santiye.visit;

import com.atalay.santiye.common.persistence.SiteCount;
import jakarta.persistence.LockModeType;
import java.time.Instant;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

interface SiteVisitRepository extends JpaRepository<SiteVisit, SiteVisitId> {

    /**
     * İlk bakış tek komutta yazılır: önce "var mı" bakıp sonra eklemek, aynı anda açılan iki sekmede (ya da çift
     * istekte) ikisini de eklemeye götürüp 500 döndürüyordu. 1: ilk bakış eklendi, 0: satır zaten vardı.
     */
    @Modifying
    @Query(value = "insert into site_visits (user_id, site_id, seen_at) values (:userId, :siteId, :seenAt) "
        + "on conflict (user_id, site_id) do nothing", nativeQuery = true)
    int insertFirst(UUID userId, UUID siteId, Instant seenAt);

    /** Var olan bakış, güncellenene kadar kilitli: önceki an iki istekte iki kez okunmasın. */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select v from SiteVisit v where v.id = :id")
    Optional<SiteVisit> findLocked(SiteVisitId id);

    @Query("select v from SiteVisit v where v.id.siteId in :siteIds")
    List<SiteVisit> findBySiteIds(Collection<UUID> siteIds);

    /**
     * Kişinin son bakışından sonra başkalarının gönderdikleri; kendi gönderisi okunmamış sayılmaz.
     * Hiç bakmadığı şantiyede since'ten (günün başı) sonrası sayılır: ilk gün eski kayıtlar yığılmaz.
     * Silinen gönderi okunmamış sayılmaz: ortada okunacak bir şey yoktur.
     */
    @Query("""
        select new com.atalay.santiye.common.persistence.SiteCount(p.siteId, count(p)) from Post p
        left join SiteVisit v on v.id.siteId = p.siteId and v.id.userId = :userId
        where p.siteId in :siteIds and p.authorId <> :userId and p.deletedAt is null
        and p.createdAt > coalesce(v.seenAt, :since)
        group by p.siteId""")
    List<SiteCount> countUnread(UUID userId, Collection<UUID> siteIds, Instant since);
}
