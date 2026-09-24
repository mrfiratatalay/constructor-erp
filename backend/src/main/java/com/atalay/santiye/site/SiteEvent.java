package com.atalay.santiye.site;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

/**
 * Akıştaki sistem satırı (WhatsApp'ta "Ahmet, Mehmet'i ekledi"). actor: işi yapan; eski kayıtlarda bilinmez.
 * subject: eklenen ya da çıkarılan kişi.
 */
@Entity
@Table(name = "site_events")
class SiteEvent {

    @Id
    private UUID id;
    private UUID siteId;
    @Enumerated(EnumType.STRING)
    private SiteEventKind kind;
    private UUID actorId;
    private UUID subjectId;
    private Instant createdAt;

    protected SiteEvent() {
    }

    SiteEvent(UUID siteId, SiteEventKind kind, UUID actorId, UUID subjectId, Instant createdAt) {
        this.id = UUID.randomUUID();
        this.siteId = siteId;
        this.kind = kind;
        this.actorId = actorId;
        this.subjectId = subjectId;
        this.createdAt = createdAt;
    }

    UUID getId() {
        return id;
    }

    UUID getSiteId() {
        return siteId;
    }

    SiteEventKind getKind() {
        return kind;
    }

    UUID getActorId() {
        return actorId;
    }

    UUID getSubjectId() {
        return subjectId;
    }

    Instant getCreatedAt() {
        return createdAt;
    }
}
