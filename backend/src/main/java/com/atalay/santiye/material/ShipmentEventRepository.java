package com.atalay.santiye.material;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

interface ShipmentEventRepository extends JpaRepository<ShipmentEvent, UUID> {
}
