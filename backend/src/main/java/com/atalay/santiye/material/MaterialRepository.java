package com.atalay.santiye.material;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

interface MaterialRepository extends JpaRepository<Material, UUID> {

    Optional<Material> findByIdAndCompanyId(UUID id, UUID companyId);

    @Query("select count(m) > 0 from Material m where m.companyId = :companyId and lower(m.name) = lower(:name) "
        + "and m.id <> :exceptId")
    boolean nameTaken(UUID companyId, String name, UUID exceptId);
}
