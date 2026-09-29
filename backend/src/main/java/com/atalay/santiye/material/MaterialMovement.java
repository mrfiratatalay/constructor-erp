package com.atalay.santiye.material;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;
import org.hibernate.annotations.Generated;

/**
 * Malzeme hareketi: stoğun tek kaynağı. Miktar, malzeme ve lokasyonlar kaydedildikten sonra değişmez; yanlış kayıt
 * iptal edilip yenisi girilir (defter iz bırakmadan değişmez). Yalnızca durum ve notlar değişir.
 */
@Entity
@Table(name = "material_movements")
class MaterialMovement {

    @Id
    private UUID id;
    @Generated
    private long number;
    private UUID companyId;
    private UUID materialId;
    @Enumerated(EnumType.STRING)
    private MovementType type;
    @Enumerated(EnumType.STRING)
    private MovementStatus status;
    private BigDecimal quantity;
    private UUID sourceId;
    private UUID destinationId;
    private UUID partyId;
    @Enumerated(EnumType.STRING)
    private MovementPurpose purpose;
    private UUID returnOfId;
    private LocalDate day;
    private LocalDate expectedReturnDate;
    private String returnNote;
    private String usageArea;
    private String reason;
    private String description;
    private BigDecimal systemQuantity;
    private BigDecimal countedQuantity;
    private UUID createdBy;
    private Instant createdAt;

    protected MaterialMovement() {
    }

    MaterialMovement(NewMovement draft, Instant createdAt) {
        this.id = draft.id();
        this.companyId = draft.companyId();
        this.materialId = draft.materialId();
        this.type = draft.type();
        this.status = draft.status();
        this.quantity = draft.quantity();
        this.sourceId = draft.sourceId();
        this.destinationId = draft.destinationId();
        this.partyId = draft.partyId();
        this.purpose = draft.purpose();
        this.returnOfId = draft.returnOfId();
        this.day = draft.day();
        this.createdBy = draft.createdBy();
        this.createdAt = createdAt;
        annotate(draft.notes());
    }

    /** Stoğa dokunmayan bilgiler: iade tarihi, notlar, kullanım alanı, sayım ayrıntısı. */
    void annotate(MovementNotes notes) {
        this.expectedReturnDate = notes.expectedReturnDate();
        this.returnNote = notes.returnNote();
        this.usageArea = notes.usageArea();
        this.reason = notes.reason();
        this.description = notes.description();
        this.systemQuantity = notes.systemQuantity();
        this.countedQuantity = notes.countedQuantity();
    }

    MovementNotes notes() {
        return new MovementNotes(expectedReturnDate, returnNote, usageArea, reason, description, systemQuantity,
            countedQuantity);
    }

    void changeStatus(MovementStatus next) {
        this.status = next;
    }

    boolean isLoan() {
        return type == MovementType.OUTBOUND && purpose == MovementPurpose.LOANED;
    }

    UUID getId() {
        return id;
    }

    long getNumber() {
        return number;
    }

    UUID getCompanyId() {
        return companyId;
    }

    UUID getMaterialId() {
        return materialId;
    }

    MovementType getType() {
        return type;
    }

    MovementStatus getStatus() {
        return status;
    }

    BigDecimal getQuantity() {
        return quantity;
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

    LocalDate day() {
        return day;
    }

    UUID getReturnOfId() {
        return returnOfId;
    }

    UUID getCreatedBy() {
        return createdBy;
    }
}
