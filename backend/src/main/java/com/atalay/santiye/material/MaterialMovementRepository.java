package com.atalay.santiye.material;

import jakarta.persistence.LockModeType;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;

interface MaterialMovementRepository extends JpaRepository<MaterialMovement, UUID> {

    Optional<MaterialMovement> findByIdAndCompanyId(UUID id, UUID companyId);

    /** İade bir ödünç çıkışına bağlanırken çıkış kilitlenir: aynı anda iki iade kalanı iki kez tüketmesin. */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select m from MaterialMovement m where m.id = :id and m.companyId = :companyId")
    Optional<MaterialMovement> lockByIdAndCompanyId(UUID id, UUID companyId);

    List<MaterialMovement> findByReturnOfIdAndStatusNot(UUID returnOfId, MovementStatus status);

    boolean existsByMaterialId(UUID materialId);
}
