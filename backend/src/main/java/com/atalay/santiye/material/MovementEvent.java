package com.atalay.santiye.material;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

/** Hareketin geçmişinden bir satır (audit): "Teslim alındı · Musa · 28 Eyl 14:20". Hiç değişmez, silinmez. */
@Entity
@Table(name = "material_movement_events")
class MovementEvent {

    @Id
    private UUID id;
    private UUID movementId;
    @Enumerated(EnumType.STRING)
    private MovementEventKind kind;
    private UUID actorId;
    private String note;
    private Instant createdAt;

    protected MovementEvent() {
    }

    MovementEvent(UUID movementId, MovementEventKind kind, UUID actorId, String note, Instant createdAt) {
        this.id = UUID.randomUUID();
        this.movementId = movementId;
        this.kind = kind;
        this.actorId = actorId;
        this.note = note;
        this.createdAt = createdAt;
    }
}
