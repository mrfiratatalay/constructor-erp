package com.atalay.santiye.attendance;

import com.atalay.santiye.common.persistence.SiteCount;
import java.util.Collection;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

interface SiteWorkerRepository extends JpaRepository<SiteWorker, UUID> {

    List<SiteWorker> findBySiteIdOrderByFullName(UUID siteId);

    @Query("select new com.atalay.santiye.common.persistence.SiteCount(w.siteId, count(w)) from SiteWorker w "
        + "where w.siteId in :siteIds group by w.siteId")
    List<SiteCount> countBySite(Collection<UUID> siteIds);
}
