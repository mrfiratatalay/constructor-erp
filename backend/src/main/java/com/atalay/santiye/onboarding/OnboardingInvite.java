package com.atalay.santiye.onboarding;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

/**
 * Satın alan firmaya gönderilen kurulum linki: tek kullanımlık, süreli; veritabanında yalnızca özeti durur. Link
 * kaybolursa yenisi üretilir, bekleyen eskisi iptal olur.
 */
@Entity
@Table(name = "tenant_onboarding_invites")
class OnboardingInvite {

    @Id
    private UUID id;
    private UUID companyId;
    private String tokenHash;
    @Enumerated(EnumType.STRING)
    private OnboardingInviteStatus status;
    private Instant expiresAt;
    private Instant usedAt;
    private UUID usedBy;
    private Instant revokedAt;
    private UUID createdBy;
    private Instant createdAt;

    protected OnboardingInvite() {
    }

    OnboardingInvite(UUID companyId, String tokenHash, Instant expiresAt, UUID createdBy, Instant now) {
        this.id = UUID.randomUUID();
        this.companyId = companyId;
        this.tokenHash = tokenHash;
        this.status = OnboardingInviteStatus.PENDING;
        this.expiresAt = expiresAt;
        this.createdBy = createdBy;
        this.createdAt = now;
    }

    boolean isUsable(Instant now) {
        return status == OnboardingInviteStatus.PENDING && now.isBefore(expiresAt);
    }

    void markUsed(UUID userId, Instant now) {
        this.status = OnboardingInviteStatus.USED;
        this.usedBy = userId;
        this.usedAt = now;
    }

    void revoke(Instant now) {
        this.status = OnboardingInviteStatus.REVOKED;
        this.revokedAt = now;
    }

    UUID getId() {
        return id;
    }

    UUID getCompanyId() {
        return companyId;
    }

    OnboardingInviteStatus getStatus() {
        return status;
    }
}
