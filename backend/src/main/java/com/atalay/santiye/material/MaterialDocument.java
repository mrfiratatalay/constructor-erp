package com.atalay.santiye.material;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

/** Hareketin belgesi: irsaliye, fatura fotoğrafı, teslim tutanağı. Dosyanın kendisi diskte (MaterialFiles). */
@Entity
@Table(name = "material_documents")
class MaterialDocument {

    @Id
    private UUID id;
    private UUID movementId;
    private UUID companyId;
    private String fileName;
    private String contentType;
    private long sizeBytes;
    private UUID createdBy;
    private Instant createdAt;

    protected MaterialDocument() {
    }

    MaterialDocument(MaterialMovement movement, DocumentFile file, UUID createdBy, Instant createdAt) {
        this.id = UUID.randomUUID();
        this.movementId = movement.getId();
        this.companyId = movement.getCompanyId();
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
