package com.atalay.santiye.production;

import com.atalay.santiye.production.dto.ProductionItemRequest;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

/**
 * Şantiyede takip edilen bir iş kalemi: "Demir İşleri · Kaya Demir · 120 ton". Gerçekleşen miktar burada durmaz,
 * girişlerin toplamıdır. Silinen imalat listeden kalkar, kaydı kalır.
 */
@Entity
@Table(name = "production_items")
class ProductionItem {

    @Id
    private UUID id;
    private UUID companyId;
    private UUID siteId;
    private String trade;
    private String title;
    private UUID crewId;
    private BigDecimal totalQuantity;
    private String unit;
    private LocalDate startDate;
    private LocalDate plannedEnd;
    private String note;
    private UUID createdBy;
    private Instant createdAt;
    private Instant deletedAt;

    protected ProductionItem() {
    }

    ProductionItem(UUID siteId, UUID companyId, UUID createdBy, Instant createdAt) {
        this.id = UUID.randomUUID();
        this.siteId = siteId;
        this.companyId = companyId;
        this.createdBy = createdBy;
        this.createdAt = createdAt;
    }

    void describe(ProductionItemRequest request) {
        this.trade = request.trade().trim();
        this.title = ProductionText.tidy(request.title());
        this.crewId = request.crewId();
        this.totalQuantity = request.totalQuantity();
        this.unit = request.unit().trim();
        this.startDate = request.startDate();
        this.plannedEnd = request.plannedEnd();
        this.note = ProductionText.tidy(request.note());
    }

    void delete(Instant at) {
        this.deletedAt = at;
    }

    /** Ekranda yazan ad: özel ad verildiyse o, yoksa türü. */
    String name() {
        return title == null ? trade : title;
    }

    UUID getId() {
        return id;
    }

    UUID getCompanyId() {
        return companyId;
    }

    UUID getSiteId() {
        return siteId;
    }

    String getTrade() {
        return trade;
    }

    String getTitle() {
        return title;
    }

    UUID getCrewId() {
        return crewId;
    }

    BigDecimal getTotalQuantity() {
        return totalQuantity;
    }

    String getUnit() {
        return unit;
    }

    LocalDate getStartDate() {
        return startDate;
    }

    LocalDate getPlannedEnd() {
        return plannedEnd;
    }

    String getNote() {
        return note;
    }

    Instant getCreatedAt() {
        return createdAt;
    }
}
