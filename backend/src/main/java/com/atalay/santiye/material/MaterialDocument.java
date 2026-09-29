package com.atalay.santiye.material;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

/** Sevkiyatın irsaliyesi: fotoğraf ya da PDF. Dosyanın kendisi diskte durur (MaterialFiles). */
@Entity
@Table(name = "material_documents")
class MaterialDocument {

    @Id
    private UUID id;
    private UUID shipmentId;
    private UUID companyId;
    private String fileName;
    private String contentType;
    private long sizeBytes;
    private UUID createdBy;
    private Instant createdAt;

    protected MaterialDocument() {
    }

    MaterialDocument(Shipment shipment, DocumentFile file, UUID createdBy, Instant createdAt) {
        this.id = UUID.randomUUID();
        this.shipmentId = shipment.getId();
        this.companyId = shipment.getCompanyId();
        this.fileName = file.fileName();
        this.contentType = file.contentType();
        this.sizeBytes = file.sizeBytes();
        this.createdBy = createdBy;
        this.createdAt = createdAt;
    }

    UUID getId() {
        return id;
    }

    UUID getCompanyId() {
        return companyId;
    }

    String getFileName() {
        return fileName;
    }

    String getContentType() {
        return contentType;
    }
}
