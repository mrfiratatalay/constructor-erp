package com.atalay.santiye.site;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "sites")
public class Site {

    @Id
    private UUID id;
    private UUID companyId;
    private String name;
    private String address;
    @Enumerated(EnumType.STRING)
    private SiteStatus status;
    private Instant createdAt;
    private UUID photoMediaId;

    protected Site() {
    }

    public Site(UUID companyId, String name, String address, Instant createdAt) {
        this.id = UUID.randomUUID();
        this.companyId = companyId;
        this.name = name;
        this.address = address;
        this.status = SiteStatus.ACTIVE;
        this.createdAt = createdAt;
    }

    public void update(String name, String address, SiteStatus status) {
        this.name = name;
        this.address = address;
        this.status = status;
    }

    /** Grup fotoğrafı gibi: patron koyar, değiştirir ya da kaldırır (null). */
    public void changePhoto(UUID mediaId) {
        this.photoMediaId = mediaId;
    }

    public UUID getId() {
        return id;
    }

    public UUID getCompanyId() {
        return companyId;
    }

    public String getName() {
        return name;
    }

    public String getAddress() {
        return address;
    }

    public SiteStatus getStatus() {
        return status;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public UUID getPhotoMediaId() {
        return photoMediaId;
    }
}
