package com.atalay.santiye.site;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SiteRepository extends JpaRepository<Site, UUID> {

    List<Site> findByCompanyIdOrderByName(UUID companyId);

    List<Site> findByCompanyIdAndIdInOrderByName(UUID companyId, Collection<UUID> ids);

    Optional<Site> findByIdAndCompanyId(UUID id, UUID companyId);

    long countByCompanyIdAndIdIn(UUID companyId, Collection<UUID> ids);
}
