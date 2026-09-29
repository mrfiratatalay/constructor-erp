package com.atalay.santiye.production;

import com.atalay.santiye.production.dto.ProductionEntryForm;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

/**
 * Bir imalatın günlük girişi: "28 Eylül · +3,5 ton". Silinen giriş hesaba katılmaz, kaydı kalır. postId: Saha'ya
 * yansıtıldıysa gönderisi (giriş silinince geri çekilir).
 */
@Entity
@Table(name = "production_entries")
class ProductionEntry {

    @Id
    private UUID id;
    private UUID itemId;
    private UUID companyId;
    private UUID siteId;
    private LocalDate day;
    private BigDecimal quantity;
    private Integer workerCount;
    private String note;
    private UUID postId;
    private UUID createdBy;
    private Instant createdAt;
    private Instant deletedAt;

    protected ProductionEntry() {
    }

    ProductionEntry(ProductionItem item, ProductionEntryForm form, UUID createdBy, Instant createdAt) {
        this.id = form.id();
        this.itemId = item.getId();
        this.companyId = item.getCompanyId();
        this.siteId = item.getSiteId();
        this.day = form.day();
        this.quantity = form.quantity();
        this.workerCount = form.workerCount();
        this.note = ProductionText.tidy(form.note());
        this.createdBy = createdBy;
        this.createdAt = createdAt;
    }

    void publishedAs(UUID fieldPostId) {
        this.postId = fieldPostId;
    }

    void delete(Instant at) {
        this.deletedAt = at;
    }

    UUID getId() {
        return id;
    }

    UUID getItemId() {
        return itemId;
    }

    LocalDate getDay() {
        return day;
    }

    BigDecimal getQuantity() {
        return quantity;
    }

    Integer getWorkerCount() {
        return workerCount;
    }

    String getNote() {
        return note;
    }

    UUID getPostId() {
        return postId;
    }

    UUID getCreatedBy() {
        return createdBy;
    }

    Instant getCreatedAt() {
        return createdAt;
    }
}
