package com.atalay.santiye.material;

import jakarta.persistence.LockModeType;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;

interface ShipmentRepository extends JpaRepository<Shipment, UUID> {

    Optional<Shipment> findByIdAndCompanyId(UUID id, UUID companyId);

    Optional<Shipment> findFirstByReturnOfIdAndCompanyIdAndStatusNot(UUID returnOfId, UUID companyId,
        ShipmentStatus status);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<Shipment> findLockedByIdAndCompanyId(UUID id, UUID companyId);
}
