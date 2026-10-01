package com.atalay.santiye.user;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

/**
 * Kişinin kimliği: adı, telefonu, girişi. Hangi firmada hangi rolde olduğu kişinin değil üyeliğinin bilgisidir
 * (tenant.Membership). "User" adı Spring Security'nin sınıfıyla çakıştığı için AppUser.
 */
@Entity
@Table(name = "users")
public class AppUser {

    @Id
    private UUID id;
    private String fullName;
    private String email;
    private String phone;
    private String passwordHash;
    @Enumerated(EnumType.STRING)
    private PlatformRole platformRole;
    private Instant createdAt;

    protected AppUser() {
    }

    public AppUser(String fullName, Instant createdAt) {
        this.id = UUID.randomUUID();
        this.fullName = fullName;
        this.createdAt = createdAt;
    }

    /** Yalnızca şifreyle giren hesaplar için (patron, platform yöneticisi). Saha ekibi bağlantıyla girer. */
    public void setPasswordLogin(String email, String passwordHash) {
        this.email = email;
        this.passwordHash = passwordHash;
    }

    public void updateProfile(String fullName, String phone) {
        this.fullName = fullName;
        this.phone = phone;
    }

    public void grantPlatformRole(PlatformRole role) {
        this.platformRole = role;
    }

    public boolean canLoginWithPassword() {
        return passwordHash != null;
    }

    /** Firmanın bağlantısıyla gelen saha hesabı: şifresi de platform rolü de yoktur, kendini bağlantıyla tanıtır. */
    public boolean isLinkOnly() {
        return passwordHash == null && platformRole == null;
    }

    public boolean isPlatformAdmin() {
        return platformRole == PlatformRole.SUPER_ADMIN;
    }

    public UUID getId() {
        return id;
    }

    public String getFullName() {
        return fullName;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public PlatformRole getPlatformRole() {
        return platformRole;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
