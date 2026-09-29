package com.atalay.santiye.material;

import com.atalay.santiye.material.dto.MaterialRequest;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

/**
 * Malzeme kartı: sabit ürün tanımı ("Çimento · Torba · Yapı"). Stok burada tutulmaz, hareketlerden hesaplanır.
 * Tek ana birimle izlenir: aynı malzeme farklı birimle girilemez. Eski malzeme silinmez, pasifleşir.
 */
@Entity
@Table(name = "materials")
class Material {

    @Id
    private UUID id;
    private UUID companyId;
    private String name;
    private String code;
    private String category;
    private String unit;
    private BigDecimal minStock;
    private String description;
    private boolean active;
    private Instant createdAt;

    protected Material() {
    }

    Material(UUID companyId, Instant createdAt) {
        this.id = UUID.randomUUID();
        this.companyId = companyId;
        this.active = true;
        this.createdAt = createdAt;
    }

    void describe(MaterialRequest request) {
        this.name = request.name();
        this.code = request.code();
        this.category = request.category();
        this.unit = request.unit();
        this.minStock = request.minStock();
        this.description = request.description();
        this.active = request.active();
    }

    UUID getId() {
        return id;
    }

    String getName() {
        return name;
    }

    String getUnit() {
        return unit;
    }

    boolean isActive() {
        return active;
    }
}
