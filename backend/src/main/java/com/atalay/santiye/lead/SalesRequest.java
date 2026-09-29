package com.atalay.santiye.lead;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

/**
 * Tanıtım sitesinden gelen başvuru (POS yok: satış buradan başlar). Ekip firmayı arar, notunu yazar; firma açılınca
 * başvuru "kazanıldı" olur ve firmaya bağlanır.
 */
@Entity
@Table(name = "sales_requests")
public class SalesRequest {

    @Id
    private UUID id;
    private String companyName;
    private String contactName;
    private String phone;
    private String email;
    private String city;
    private Integer siteCount;
    private UUID planId;
    private String message;
    @Enumerated(EnumType.STRING)
    private SalesRequestStatus status;
    private String notes;
    private UUID companyId;
    private Instant createdAt;
    private Instant updatedAt;

    protected SalesRequest() {
    }

    public SalesRequest(SalesRequestForm form, Instant now) {
        this.id = UUID.randomUUID();
        this.companyName = form.companyName();
        this.contactName = form.contactName();
        this.phone = form.phone();
        this.email = form.email();
        this.city = form.city();
        this.siteCount = form.siteCount();
        this.planId = form.planId();
        this.message = form.message();
        this.status = SalesRequestStatus.NEW;
        this.createdAt = now;
        this.updatedAt = now;
    }

    void follow(SalesRequestStatus status, String notes, Instant now) {
        this.status = status;
        this.notes = notes;
        this.updatedAt = now;
    }

    void convertTo(UUID companyId, Instant now) {
        this.status = SalesRequestStatus.WON;
        this.companyId = companyId;
        this.updatedAt = now;
    }

    public UUID getId() {
        return id;
    }

    public String getCompanyName() {
        return companyName;
    }

    public SalesRequestStatus getStatus() {
        return status;
    }
}
