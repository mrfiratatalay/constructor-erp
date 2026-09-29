package com.atalay.santiye.platform;

import com.atalay.santiye.audit.AuditAction;
import com.atalay.santiye.audit.AuditEvent;
import com.atalay.santiye.audit.PlatformAudit;
import com.atalay.santiye.billing.Payment;
import com.atalay.santiye.billing.PaymentDraft;
import com.atalay.santiye.billing.PlanRepository;
import com.atalay.santiye.billing.Subscription;
import com.atalay.santiye.billing.SubscriptionOrder;
import com.atalay.santiye.billing.SubscriptionService;
import com.atalay.santiye.billing.SubscriptionStatus;
import com.atalay.santiye.common.error.ApiException;
import com.atalay.santiye.company.CompanyRepository;
import com.atalay.santiye.platform.dto.ExtendSubscriptionRequest;
import com.atalay.santiye.platform.dto.PaymentRequest;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Platform tarafından abonelik ve ödeme: her işlem izini platform işlem geçmişine bırakır. */
@Service
public class PlatformBilling {

    private static final DateTimeFormatter DAY = DateTimeFormatter.ofPattern("dd.MM.yyyy");

    private final SubscriptionService subscriptions;
    private final PlanRepository plans;
    private final CompanyRepository companies;
    private final PlatformAudit audit;

    PlatformBilling(SubscriptionService subscriptions, PlanRepository plans, CompanyRepository companies,
        PlatformAudit audit) {
        this.subscriptions = subscriptions;
        this.plans = plans;
        this.companies = companies;
        this.audit = audit;
    }

    /** Yeni dönem (başlat ya da uzat); ödeme de alındıysa aynı işlemde bu döneme kaydedilir. */
    @Transactional
    public Subscription extend(UUID companyId, ExtendSubscriptionRequest request, UUID actor) {
        requireCompany(companyId);
        Subscription period = startPeriod(companyId,
            new SubscriptionOrder(request.planId(), request.months(), request.startsOn(), request.note()), actor);
        if (request.payment() != null) {
            recordPayment(companyId, request.payment(), period.getId(), actor);
        }
        return period;
    }

    @Transactional
    public Subscription startPeriod(UUID companyId, SubscriptionOrder order, UUID actor) {
        Subscription period = subscriptions.extend(companyId, order, actor);
        String planName = plans.findById(order.planId()).map(plan -> plan.getName()).orElse("");
        audit.record(actor, AuditEvent.of(AuditAction.SUBSCRIPTION_EXTENDED, companyId,
            "Abonelik: %s, %d ay (%s – %s)".formatted(planName, order.months(), DAY.format(period.getStartsOn()),
                DAY.format(period.getEndsOn()))).with(Map.of("subscriptionId", period.getId().toString())));
        return period;
    }

    @Transactional
    public void changePlan(UUID companyId, UUID subscriptionId, UUID planId, UUID actor) {
        Subscription period = subscriptions.changePlan(companyId, subscriptionId, planId);
        String planName = plans.findById(period.getPlanId()).map(plan -> plan.getName()).orElse("");
        audit.record(actor, AuditEvent.of(AuditAction.SUBSCRIPTION_PLAN_CHANGED, companyId,
            "Paket değişti: " + planName).with(Map.of("subscriptionId", subscriptionId.toString())));
    }

    @Transactional
    public void changeStatus(UUID companyId, UUID subscriptionId, SubscriptionStatus status, UUID actor) {
        subscriptions.changeStatus(companyId, subscriptionId, status);
        audit.record(actor, AuditEvent.of(AuditAction.SUBSCRIPTION_STATUS_CHANGED, companyId,
            "Abonelik " + StatusNames.of(status)).with(Map.of("subscriptionId", subscriptionId.toString())));
    }

    @Transactional
    public Payment recordPayment(UUID companyId, PaymentRequest request, UUID subscriptionId, UUID actor) {
        requireCompany(companyId);
        UUID period = subscriptionId != null ? subscriptionId : request.subscriptionId();
        Payment payment = subscriptions.recordPayment(companyId, new PaymentDraft(period, request.amount(),
            request.method(), request.paidOn(), request.description()), actor);
        audit.record(actor, AuditEvent.of(AuditAction.PAYMENT_RECORDED, companyId,
            "Ödeme alındı: %s TL (%s, %s)".formatted(request.amount().toPlainString(), StatusNames.of(request.method()),
                DAY.format(request.paidOn()))).with(Map.of("paymentId", payment.getId().toString())));
        return payment;
    }

    private void requireCompany(UUID companyId) {
        if (!companies.existsById(companyId)) {
            throw ApiException.notFound("Firma bulunamadı.");
        }
    }
}
