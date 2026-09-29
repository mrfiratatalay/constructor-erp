package com.atalay.santiye.media;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

/**
 * Gönderinin dosyası; postId boşsa şantiyenin kendi fotoğrafıdır (WhatsApp'taki grup fotoğrafı) ya da imalat
 * girişinin Saha'ya yansıtılmamış dosyasıdır (productionEntryId dolu).
 */
@Entity
@Table(name = "media")
public class Media {

    @Id
    private UUID id;
    private UUID postId;
    private UUID productionEntryId;
    private UUID siteId;
    private UUID companyId;
    @Enumerated(EnumType.STRING)
    private MediaKind kind;
    @Enumerated(EnumType.STRING)
    private MediaStatus status;
    private int position;
    private String originalType;
    private long sizeBytes;
    private Double durationSeconds;
    private String fileName;
    private Instant createdAt;

    protected Media() {
    }

    Media(MediaOwner owner, MediaKind kind, int position, Upload upload) {
        this.id = UUID.randomUUID();
        this.postId = owner.postId();
        this.productionEntryId = owner.productionEntryId();
        this.siteId = owner.siteId();
        this.companyId = owner.companyId();
        this.kind = kind;
        this.status = MediaStatus.PROCESSING;
        this.position = position;
        this.originalType = upload.contentType();
        this.sizeBytes = upload.sizeBytes();
        this.fileName = upload.fileName();
        this.createdAt = upload.receivedAt();
    }

    /** İletilen gönderinin kopyası: dosyalar hazırdır, yeniden işlenmez. */
    Media(MediaOwner owner, Media source, Instant copiedAt) {
        this.id = UUID.randomUUID();
        this.postId = owner.postId();
        this.siteId = owner.siteId();
        this.companyId = owner.companyId();
        this.kind = source.kind;
        this.status = MediaStatus.READY;
        this.position = source.position;
        this.originalType = source.originalType;
        this.sizeBytes = source.sizeBytes;
        this.durationSeconds = source.durationSeconds;
        this.fileName = source.fileName;
        this.createdAt = copiedAt;
    }

    /** Yüklenen dosyanın özeti. fileName yalnızca belgede ekranda gösterilir. */
    record Upload(String contentType, long sizeBytes, String fileName, Instant receivedAt) {
    }

    public UUID getId() {
        return id;
    }

    /** İmalat girişinin dosyası: Saha gönderisi silinse de girişte kalır. */
    boolean belongsToEntry() {
        return productionEntryId != null;
    }

    void detachFromPost() {
        this.postId = null;
    }

    public UUID getProductionEntryId() {
        return productionEntryId;
    }

    public UUID getPostId() {
        return postId;
    }

    public UUID getSiteId() {
        return siteId;
    }

    public UUID getCompanyId() {
        return companyId;
    }

    public MediaKind getKind() {
        return kind;
    }

    public MediaStatus getStatus() {
        return status;
    }

    public Double getDurationSeconds() {
        return durationSeconds;
    }

    public long getSizeBytes() {
        return sizeBytes;
    }

    public String getFileName() {
        return fileName;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
