package com.atalay.santiye.company;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

/** Constructor ERP'nin müşterisi olan firma: tenant. Firmaya ait her iş verisi company_id ile ona bağlıdır. */
@Entity
@Table(name = "companies")
public class Company {

    @Id
    private UUID id;
    private String name;
    private String slug;
    @Enumerated(EnumType.STRING)
    private CompanyStatus status;
    private String phone;
    private String email;
    private String city;
    private String logoContentType;
    private Instant logoUpdatedAt;
    private Instant setupCompletedAt;
    private Instant createdAt;
    private Instant updatedAt;
    private String joinToken;

    protected Company() {
    }

    public Company(String name, String slug, Instant createdAt) {
        this.id = UUID.randomUUID();
        this.name = name;
        this.slug = slug;
        this.status = CompanyStatus.ACTIVE;
        this.createdAt = createdAt;
        this.updatedAt = createdAt;
    }

    public void updateProfile(CompanyProfile profile, Instant now) {
        this.name = profile.name();
        this.phone = profile.phone();
        this.email = profile.email();
        this.city = profile.city();
        this.updatedAt = now;
    }

    public void changeStatus(CompanyStatus status, Instant now) {
        this.status = status;
        this.updatedAt = now;
    }

    public void changeLogo(String contentType, Instant now) {
        this.logoContentType = contentType;
        this.logoUpdatedAt = contentType == null ? null : now;
        this.updatedAt = now;
    }

    /** Firmanın ilk patronu kurulum sihirbazını bitirdi: çalışma alanı kullanıma hazır. */
    public void completeSetup(Instant now) {
        this.setupCompletedAt = now;
        this.updatedAt = now;
    }

    /** Firmaya katılma bağlantısının anahtarı; yenisi yazılınca eski bağlantı çalışmaz. */
    public void renewJoinToken(String token) {
        this.joinToken = token;
    }

    /** Tarayıcı önbelleği logo değişince eski resmi göstermesin diye adres değişim anını taşır. */
    public String getLogoUrl() {
        return logoUpdatedAt == null ? null : "/api/public/companies/" + id + "/logo?v=" + logoUpdatedAt.toEpochMilli();
    }

    public UUID getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getSlug() {
        return slug;
    }

    public CompanyStatus getStatus() {
        return status;
    }

    public String getPhone() {
        return phone;
    }

    public String getEmail() {
        return email;
    }

    public String getCity() {
        return city;
    }

    public String getLogoContentType() {
        return logoContentType;
    }

    public boolean isSetupCompleted() {
        return setupCompletedAt != null;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public String getJoinToken() {
        return joinToken;
    }
}
