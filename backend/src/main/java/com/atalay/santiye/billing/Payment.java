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

/** Firmadan alınan ödeme; hangi abonelik dönemi için alındığı bilinirse ona bağlanır. Silinmez. */
@Entity
@Table(name = "payments")
public class Payment {

    @Id
    private UUID id;
    private UUID companyId;
    private UUID subscriptionId;
    private BigDecimal amount;
    private String currency;
    @Enumerated(EnumType.STRING)
    private PaymentMethod method;
    private LocalDate paidOn;
    private String description;
    private UUID createdBy;
    private Instant createdAt;

    protected Payment() {
    }

    public Payment(UUID companyId, PaymentDraft draft, UUID createdBy, Instant now) {
        this.id = UUID.randomUUID();
        this.companyId = companyId;
        this.subscriptionId = draft.subscriptionId();
        this.amount = draft.amount();
        this.currency = "TRY";
        this.method = draft.method();
        this.paidOn = draft.paidOn();
        this.description = draft.description();
        this.createdBy = createdBy;
        this.createdAt = now;
    }

    public UUID getId() {
        return id;
    }

    public UUID getCompanyId() {
        return companyId;
    }

    public UUID getSubscriptionId() {
        return subscriptionId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public String getCurrency() {
        return currency;
    }

    public PaymentMethod getMethod() {
        return method;
    }

    public LocalDate getPaidOn() {
        return paidOn;
    }

    public String getDescription() {
        return description;
    }

    public UUID getCreatedBy() {
        return createdBy;
    }
}
