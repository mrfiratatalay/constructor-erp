package com.atalay.santiye.attendance;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

interface SiteWorkerRepository extends JpaRepository<SiteWorker, UUID> {

    List<SiteWorker> findBySiteIdOrderByFullName(UUID siteId);
}
