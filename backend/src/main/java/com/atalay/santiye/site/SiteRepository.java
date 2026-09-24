package com.atalay.santiye.site;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SiteRepository extends JpaRepository<Site, UUID> {

    List<Site> findByCompanyIdOrderByName(UUID companyId);

    Optional<Site> findByIdAndCompanyId(UUID id, UUID companyId);
}
