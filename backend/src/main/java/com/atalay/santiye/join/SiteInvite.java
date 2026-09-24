package com.atalay.santiye.join;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

/** Şantiyeye davet bağlantısı. Token açık saklanmaz, yalnızca özeti durur; kim kullandıysa kaydı kalır. */
@Entity
@Table(name = "site_invites")
class SiteInvite {

    @Id
    private UUID id;
    private UUID siteId;
    private UUID createdBy;
    private String tokenHash;
    private Instant createdAt;
    private Instant expiresAt;
    private Instant usedAt;
    private UUID usedBy;

    protected SiteInvite() {
    }

    SiteInvite(UUID siteId, UUID createdBy, String tokenHash, Instant createdAt, Instant expiresAt) {
        this.id = UUID.randomUUID();
        this.siteId = siteId;
        this.createdBy = createdBy;
        this.tokenHash = tokenHash;
        this.createdAt = createdAt;
        this.expiresAt = expiresAt;
    }

    /** Tek kişilik: biri katılınca bağlantı biter; yanlış kişiye iletilse de en fazla bir kişi girer. */
    boolean isUsable(Instant now) {
        return usedAt == null && now.isBefore(expiresAt);
    }

    void markUsed(UUID userId, Instant now) {
        this.usedBy = userId;
        this.usedAt = now;
    }

    UUID getSiteId() {
        return siteId;
    }

    UUID getCreatedBy() {
        return createdBy;
    }

    Instant getExpiresAt() {
        return expiresAt;
    }
}
