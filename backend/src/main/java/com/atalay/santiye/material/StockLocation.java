package com.atalay.santiye.material;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

/**
 * Stoğun durduğu yer. Depo adıyla eklenir ("Ana Depo"); şantiye lokasyonu şantiyeye bağlıdır, adını oradan alır ve
 * şantiye kurulunca kendiliğinden açılır.
 */
@Entity
@Table(name = "stock_locations")
class StockLocation {

    @Id
    private UUID id;
    private UUID companyId;
    @Enumerated(EnumType.STRING)
    private LocationKind kind;
    private UUID siteId;
    private String name;
    private Instant createdAt;

    protected StockLocation() {
    }

    private StockLocation(UUID companyId, LocationKind kind, Instant createdAt) {
        this.id = UUID.randomUUID();
        this.companyId = companyId;
        this.kind = kind;
        this.createdAt = createdAt;
    }

    static StockLocation depot(UUID companyId, String name, Instant createdAt) {
        StockLocation location = new StockLocation(companyId, LocationKind.DEPOT, createdAt);
        location.name = name;
        return location;
    }

    UUID getId() {
        return id;
    }

    LocationKind getKind() {
        return kind;
    }

    UUID getSiteId() {
        return siteId;
    }
}
