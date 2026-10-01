package com.atalay.santiye.material;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Objects;
import java.util.UUID;
import org.hibernate.annotations.Generated;
import org.hibernate.generator.EventType;

/**
 * Bir sevkiyat bir kamyondur: tek hedef, tek irsaliye, içinde birden çok kalem (ShipmentLine). Kimliği istemci
 * üretir, aynı istek iki kez gelirse ikinci kayıt açılmaz. Numarası ("SV-000123") kimlikten ayrı ve değişmezdir.
 */
@Entity
@Table(name = "material_shipments")
class Shipment {

    @Id
    private UUID id;
    /** Numarayı veritabanı sırası üretir ("SV-000123"); kayıttan sonra geri okunur, hiç değişmez. */
    @Generated(event = EventType.INSERT)
    @Column(insertable = false, updatable = false)
    private Long number;
    private UUID companyId;
    @Enumerated(EnumType.STRING)
    private ShipmentType type;
    @Enumerated(EnumType.STRING)
    private ShipmentStatus status;
    private UUID sourceId;
    private UUID destinationId;
    private UUID partyId;
    private boolean expectsReturn;
    private UUID returnOfId;
    private LocalDate day;
    private String description;
    private UUID createdBy;
    private Instant createdAt;

    protected Shipment() {
    }

    Shipment(UUID id, UUID companyId, ShipmentRoute route, UUID createdBy, Instant createdAt) {
        this.id = id;
        this.companyId = companyId;
        this.type = route.type();
        this.status = ShipmentStatus.RECORDED;
        this.sourceId = route.sourceId();
        this.destinationId = route.destinationId();
        this.partyId = route.partyId();
        this.createdBy = createdBy;
        this.createdAt = createdAt;
    }

    void describe(LocalDate day, String description, boolean expectsReturn, UUID returnOfId) {
        this.day = day;
        this.description = description;
        this.expectsReturn = expectsReturn;
        this.returnOfId = returnOfId;
    }

    void cancel() {
        this.status = ShipmentStatus.CANCELLED;
    }

    void edit(LocalDate day, String description) {
        this.day = day;
        this.description = description;
    }

    boolean hasDetails(LocalDate day, String description) {
        return Objects.equals(this.day, day) && Objects.equals(this.description, description);
    }

    LocalDate getDay() {
        return day;
    }

    String getDescription() {
        return description;
    }

    UUID getId() {
        return id;
    }

    Long getNumber() {
        return number;
    }

    UUID getCompanyId() {
        return companyId;
    }

    ShipmentType getType() {
        return type;
    }

    ShipmentStatus getStatus() {
        return status;
    }

    UUID getSourceId() {
        return sourceId;
    }

    UUID getDestinationId() {
        return destinationId;
    }

    UUID getPartyId() {
        return partyId;
    }

    boolean expectsReturn() {
        return expectsReturn;
    }
}
