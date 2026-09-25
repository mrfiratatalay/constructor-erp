package com.atalay.santiye.site;

import java.util.Collection;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

interface SiteEventRepository extends JpaRepository<SiteEvent, UUID> {

    /** Aynı anda yazılan olaylarda kuruluş, eklemeden önce gelir (tür adına göre). */
    @Query("select e from SiteEvent e where e.siteId = :siteId order by e.createdAt, e.kind")
    List<SiteEvent> findBySite(UUID siteId);

    /** Şantiyelerin kuruluş satırları ("Patron şantiyeyi kurdu"); her şantiyede bir tane. */
    @Query("select e from SiteEvent e where e.siteId in :siteIds "
        + "and e.kind = com.atalay.santiye.site.SiteEventKind.CREATED")
    List<SiteEvent> findCreationOf(Collection<UUID> siteIds);
}
