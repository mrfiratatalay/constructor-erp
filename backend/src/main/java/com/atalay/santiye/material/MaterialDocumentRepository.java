package com.atalay.santiye.material;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

interface MaterialDocumentRepository extends JpaRepository<MaterialDocument, UUID> {

    Optional<MaterialDocument> findByIdAndCompanyId(UUID id, UUID companyId);
}
