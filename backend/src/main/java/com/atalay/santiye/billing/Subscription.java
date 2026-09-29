package com.atalay.santiye.billing;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

/**
 * Bir abonelik dönemi: hangi paket, hangi tarihler arası, o günkü aylık fiyatla. Uzatma yeni dönemdir; eski dönemin
 * fiyatı ve tarihleri değişmez. Firmaya aittir ama platform tablosudur: yalnızca platform yönetimi yazar.
 */
@Entity
@Table(name = "subscriptions")
public class Subscription {

    @Id
    private UUID id;
    private UUID companyId;
    private UUID planId;
    @Enumerated(EnumType.STRING)
    private SubscriptionStatus status;
    private LocalDate startsOn;
    private LocalDate endsOn;
    private BigDecimal priceSnapshot;
    private String currency;
    private String note;
    private UUID createdBy;
    private Instant createdAt;
    private Instant updatedAt;

    protected Subscription() {
    }

    public Subscription(UUID companyId, Plan plan, SubscriptionPeriod period, UUID createdBy, Instant now) {
        this.id = UUID.randomUUID();
        this.companyId = companyId;
        this.planId = plan.getId();
        this.status = SubscriptionStatus.ACTIVE;
        this.startsOn = period.startsOn();
        this.endsOn = period.endsOn();
        this.priceSnapshot = plan.getMonthlyPrice();
        this.currency = plan.getCurrency();
        this.note = period.note();
        this.createdBy = createdBy;
        this.createdAt = now;
        this.updatedAt = now;
    }

    public SubscriptionState stateOn(LocalDate day) {
        return switch (status) {
            case SUSPENDED -> SubscriptionState.SUSPENDED;
            case CANCELLED -> SubscriptionState.CANCELLED;
            case ACTIVE -> day.isBefore(startsOn) ? SubscriptionState.SCHEDULED
                : day.isAfter(endsOn) ? SubscriptionState.EXPIRED : SubscriptionState.ACTIVE;
        };
    }

    public boolean covers(LocalDate day) {
        return !day.isBefore(startsOn) && !day.isAfter(endsOn);
    }

    /** Dönemin paketi değişir; fiyat anlık görüntüsü yeni paketin bugünkü fiyatı olur. */
    public void changePlan(Plan plan, Instant now) {
        this.planId = plan.getId();
        this.priceSnapshot = plan.getMonthlyPrice();
        this.currency = plan.getCurrency();
        this.updatedAt = now;
    }

    public void changeStatus(SubscriptionStatus status, Instant now) {
        this.status = status;
        this.updatedAt = now;
    }

    public UUID getId() {
        return id;
    }

    public UUID getCompanyId() {
        return companyId;
    }

    public UUID getPlanId() {
        return planId;
    }

    public SubscriptionStatus getStatus() {
        return status;
    }

    public LocalDate getStartsOn() {
        return startsOn;
    }

    public LocalDate getEndsOn() {
        return endsOn;
    }

    public BigDecimal getPriceSnapshot() {
        return priceSnapshot;
    }

    public String getCurrency() {
        return currency;
    }

    public String getNote() {
        return note;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
