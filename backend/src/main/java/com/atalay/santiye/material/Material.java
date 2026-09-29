package com.atalay.santiye.material;

import com.atalay.santiye.material.dto.MaterialRequest;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

/**
 * Malzeme kartı: ad ve ana birim ("Çimento · Torba"). Kategori ve kritik eşik kalktı; kategori sahada birim gibi
 * dolduruluyordu, kritik eşik ise stok sayılmadan anlamsızdı. Eski malzeme silinmez, pasifleşir.
 */
@Entity
@Table(name = "materials")
class Material {

    @Id
    private UUID id;
    private UUID companyId;
    private String name;
    private String unit;
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
        this.unit = request.unit();
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
}
