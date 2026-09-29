package com.atalay.santiye.tenant;

import com.atalay.santiye.user.UserRole;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

/**
 * Kişinin bir firmadaki yeri: rolü ve firmada olup olmadığı. Kişi (users) yalnızca kimliktir; aynı kişi ileride
 * birden çok firmada farklı rollerle bulunabilir. Firmadan çıkarılan kişinin üyeliği silinmez, pasifleşir: yazdıkları
 * şantiyelerde durur, geri alınırsa aynı kişi olarak döner.
 */
@Entity
@Table(name = "company_memberships")
public class Membership {

    @Id
    private UUID id;
    private UUID companyId;
    private UUID userId;
    @Enumerated(EnumType.STRING)
    private UserRole role;
    private boolean active;
    private Instant createdAt;

    protected Membership() {
    }

    public Membership(UUID companyId, UUID userId, UserRole role, Instant createdAt) {
        this.id = UUID.randomUUID();
        this.companyId = companyId;
        this.userId = userId;
        this.role = role;
        this.active = true;
        this.createdAt = createdAt;
    }

    public void changeRole(UserRole role) {
        this.role = role;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public UUID getId() {
        return id;
    }

    public UUID getCompanyId() {
        return companyId;
    }

    public UUID getUserId() {
        return userId;
    }

    public UserRole getRole() {
        return role;
    }

    public boolean isActive() {
        return active;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
