package com.atalay.santiye.visit;

import com.atalay.santiye.common.persistence.SiteCount;
import java.time.Instant;
import java.util.Collection;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

interface SiteVisitRepository extends JpaRepository<SiteVisit, SiteVisitId> {

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
