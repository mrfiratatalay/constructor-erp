package com.atalay.santiye.user;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

/** "User" adı Spring Security'nin sınıfıyla çakıştığı için AppUser. */
@Entity
@Table(name = "users")
public class AppUser {

    @Id
    private UUID id;
    private UUID companyId;
    private String fullName;
    private String email;
    private String phone;
    private String passwordHash;
    @Enumerated(EnumType.STRING)
    private UserRole role;
    private boolean active;
    private Instant createdAt;

    protected AppUser() {
    }

    public AppUser(UUID companyId, String fullName, UserRole role, Instant createdAt) {
        this.id = UUID.randomUUID();
        this.companyId = companyId;
        this.fullName = fullName;
        this.role = role;
        this.active = true;
        this.createdAt = createdAt;
    }

    /** Yalnızca şifreyle giren hesaplar için (ilk yönetici). Saha ekibi davet linkiyle girer. */
    public void setPasswordLogin(String email, String passwordHash) {
        this.email = email;
        this.passwordHash = passwordHash;
    }

    public void updateProfile(String fullName, String phone, UserRole role) {
        this.fullName = fullName;
        this.phone = phone;
        this.role = role;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public boolean canLoginWithPassword() {
        return active && passwordHash != null;
    }

    public UUID getId() {
        return id;
    }

    public UUID getCompanyId() {
        return companyId;
    }

    public String getFullName() {
        return fullName;
    }

    public String getPhone() {
        return phone;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public UserRole getRole() {
        return role;
    }

    public boolean isActive() {
        return active;
    }
}
