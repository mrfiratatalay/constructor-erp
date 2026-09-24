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

    /** Şantiye başına en son olay: hiç mesajı olmayan şantiyenin satır önizlemesi. */
    @Query("select e from SiteEvent e where e.siteId in :siteIds and e.createdAt = "
        + "(select max(f.createdAt) from SiteEvent f where f.siteId = e.siteId) order by e.kind desc")
    List<SiteEvent> findLatestPerSite(Collection<UUID> siteIds);
}
