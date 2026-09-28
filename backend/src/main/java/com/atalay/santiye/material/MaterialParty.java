package com.atalay.santiye.material;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

/** Şirket dışındaki taraf: tedarikçi, müteahhit, firma ya da teslim alan kişi ("ABC İnşaat"). */
@Entity
@Table(name = "material_parties")
class MaterialParty {

    @Id
    private UUID id;
    private UUID companyId;
    private String name;
    private Instant createdAt;

    protected MaterialParty() {
    }

    MaterialParty(UUID companyId, String name, Instant createdAt) {
        this.id = UUID.randomUUID();
        this.companyId = companyId;
        this.name = name;
        this.createdAt = createdAt;
    }

    UUID getId() {
        return id;
    }

    String getName() {
        return name;
    }
}
