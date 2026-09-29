package com.atalay.santiye.material;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.util.UUID;

/** Sevkiyatın bir kalemi: hangi malzemeden ne kadar. Bir kamyon birden çok kalem taşır, irsaliye tektir. */
@Entity
@Table(name = "material_shipment_lines")
class ShipmentLine {

    @Id
    private UUID id;
    private UUID shipmentId;
    private UUID materialId;
    private BigDecimal quantity;

    protected ShipmentLine() {
    }

    ShipmentLine(UUID shipmentId, UUID materialId, BigDecimal quantity) {
        this.id = UUID.randomUUID();
        this.shipmentId = shipmentId;
        this.materialId = materialId;
        this.quantity = quantity;
    }

    UUID getMaterialId() {
        return materialId;
    }

    BigDecimal getQuantity() {
        return quantity;
    }
}
