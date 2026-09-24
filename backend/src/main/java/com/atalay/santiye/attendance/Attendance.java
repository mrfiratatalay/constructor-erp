package com.atalay.santiye.attendance;

import com.atalay.santiye.site.Site;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

/** Bir şantiyenin bir günlük yoklaması. Şantiye ve gün başına tektir; yanlışlık düzenlenerek düzeltilir. */
@Entity
@Table(name = "attendances")
public class Attendance {

    @Id
    private UUID id;
    private UUID companyId;
    private UUID siteId;
    private LocalDate day;
    private UUID takenBy;
    private Instant createdAt;
    private UUID updatedBy;
    private Instant updatedAt;

    protected Attendance() {
    }

    Attendance(Site site, LocalDate day, UUID takenBy, Instant createdAt) {
        this.id = UUID.randomUUID();
        this.companyId = site.getCompanyId();
        this.siteId = site.getId();
        this.day = day;
        this.takenBy = takenBy;
        this.createdAt = createdAt;
        this.updatedBy = takenBy;
        this.updatedAt = createdAt;
    }

    void markEdited(UUID by, Instant at) {
        this.updatedBy = by;
        this.updatedAt = at;
    }

    public UUID getId() {
        return id;
    }

    public UUID getSiteId() {
        return siteId;
    }

    public LocalDate getDay() {
        return day;
    }

    public UUID getTakenBy() {
        return takenBy;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
}
