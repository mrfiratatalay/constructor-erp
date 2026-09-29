package com.atalay.santiye.material;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

interface MaterialPartyRepository extends JpaRepository<MaterialParty, UUID> {

    List<MaterialParty> findByCompanyIdOrderByName(UUID companyId);

    Optional<MaterialParty> findByIdAndCompanyId(UUID id, UUID companyId);

    @Query("select p from MaterialParty p where p.companyId = :companyId and lower(p.name) = lower(:name)")
    Optional<MaterialParty> findByName(UUID companyId, String name);
}
