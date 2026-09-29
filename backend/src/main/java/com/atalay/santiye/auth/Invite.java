package com.atalay.santiye.auth;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

/** Tek kullanımlık giriş linki; hangi firmanın patronu ürettiyse oturum o firmada açılır. */
@Entity
@Table(name = "invites")
class Invite {

    @Id
    private UUID id;
    private UUID userId;
    private UUID companyId;
    private String tokenHash;
    private Instant createdAt;
    private Instant expiresAt;
    private Instant usedAt;

    protected Invite() {
    }

    Invite(UUID userId, UUID companyId, String tokenHash, Instant createdAt, Instant expiresAt) {
        this.id = UUID.randomUUID();
        this.userId = userId;
        this.companyId = companyId;
        this.tokenHash = tokenHash;
        this.createdAt = createdAt;
        this.expiresAt = expiresAt;
    }

    /** Tek kullanımlık: bir kez açılan link bir daha giriş yaptırmaz. */
    boolean isUsable(Instant now) {
        return usedAt == null && now.isBefore(expiresAt);
    }

    void markUsed(Instant now) {
        this.usedAt = now;
    }

    UUID getUserId() {
        return userId;
    }

    UUID getCompanyId() {
        return companyId;
    }
}
