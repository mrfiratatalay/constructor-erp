package com.atalay.santiye.material;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

interface ShipmentLineRepository extends JpaRepository<ShipmentLine, UUID> {

    List<ShipmentLine> findByShipmentId(UUID shipmentId);
}
