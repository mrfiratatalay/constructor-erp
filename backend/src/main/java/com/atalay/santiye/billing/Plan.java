package com.atalay.santiye.billing;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

/**
 * Satılan paket. Fiyatı ve sınırları veridir, kodda sabit değildir: platform yönetimi değiştirir, tanıtım sitesi
 * buradan okur. Fiyatı boş paket teklifle satılır; sınırı boş olan sınırsızdır.
 */
@Entity
@Table(name = "plans")
public class Plan {

    @Id
    private UUID id;
    private String code;
    private String name;
    private String tagline;
    private BigDecimal monthlyPrice;
    private String currency;
    private Integer maxUsers;
    private Integer maxSites;
    private boolean highlighted;
    private boolean visible;
    @Enumerated(EnumType.STRING)
    private PlanStatus status;
    private int sortOrder;
    private Instant createdAt;
    private Instant updatedAt;

    protected Plan() {
    }

    public void update(PlanTerms terms, Instant now) {
        this.name = terms.name();
        this.tagline = terms.tagline();
        this.monthlyPrice = terms.monthlyPrice();
        this.maxUsers = terms.maxUsers();
        this.maxSites = terms.maxSites();
        this.highlighted = terms.highlighted();
        this.visible = terms.visible();
        this.status = terms.status();
        this.updatedAt = now;
    }

    public UUID getId() {
        return id;
    }

    public String getCode() {
        return code;
    }

    public String getName() {
        return name;
    }

    public String getTagline() {
        return tagline;
    }

    public BigDecimal getMonthlyPrice() {
        return monthlyPrice;
    }

    public String getCurrency() {
        return currency;
    }

    public Integer getMaxUsers() {
        return maxUsers;
    }

    public Integer getMaxSites() {
        return maxSites;
    }

    public boolean isHighlighted() {
        return highlighted;
    }

    public boolean isVisible() {
        return visible;
    }

    public PlanStatus getStatus() {
        return status;
    }

    public int getSortOrder() {
        return sortOrder;
    }
}
