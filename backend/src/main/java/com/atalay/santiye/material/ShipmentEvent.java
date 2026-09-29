package com.atalay.santiye.material;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

/** Sevkiyatın geçmişinden bir satır: "Teslim alındı · Musa · 28 Eyl 14:20". Hiç değişmez, silinmez. */
@Entity
@Table(name = "material_shipment_events")
class ShipmentEvent {

    @Id
    private UUID id;
    private UUID shipmentId;
    @Enumerated(EnumType.STRING)
    private ShipmentEventKind kind;
    private UUID actorId;
    private String note;
    private Instant createdAt;

    protected ShipmentEvent() {
    }

    ShipmentEvent(UUID shipmentId, ShipmentEventKind kind, UUID actorId, String note, Instant createdAt) {
        this.id = UUID.randomUUID();
        this.shipmentId = shipmentId;
        this.kind = kind;
        this.actorId = actorId;
        this.note = note;
        this.createdAt = createdAt;
    }
}
