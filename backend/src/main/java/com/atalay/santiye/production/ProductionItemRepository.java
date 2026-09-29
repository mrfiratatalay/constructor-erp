package com.atalay.santiye.production;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

interface ProductionItemRepository extends JpaRepository<ProductionItem, UUID> {

    List<ProductionItem> findBySiteIdAndDeletedAtIsNullOrderByCreatedAt(UUID siteId);

    Optional<ProductionItem> findByIdAndCompanyIdAndDeletedAtIsNull(UUID id, UUID companyId);
}
