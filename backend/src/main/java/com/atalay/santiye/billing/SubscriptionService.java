package com.atalay.santiye.billing;

import com.atalay.santiye.common.error.ApiException;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Abonelik işlemleri: başlatma/uzatma (yeni dönem), paket değiştirme, askıya alma, iptal ve ödeme kaydı. Her
 * değişiklikten sonra firmanın erişim önbelleği silinir: kilit hemen açılır ya da kapanır.
 */
@Service
public class SubscriptionService {

    public static final String DEFAULT_PLAN = "professional";

    private final SubscriptionRepository subscriptions;
    private final PaymentRepository payments;
    private final PlanRepository plans;
    private final WorkspaceAccess access;
    private final Clock clock;

    SubscriptionService(SubscriptionRepository subscriptions, PaymentRepository payments, PlanRepository plans,
        WorkspaceAccess access, Clock clock) {
        this.subscriptions = subscriptions;
        this.payments = payments;
        this.plans = plans;
        this.access = access;
        this.clock = clock;
    }

    /**
     * Yeni dönem: bugün açık bir dönem varsa onun bitişinin ertesi günü, yoksa verilen gün (boşsa bugün) başlar ve
     * ay sayısı kadar sürer. Böylece erken yapılan uzatma kalan günleri yakmaz.
     */
    @Transactional
    public Subscription extend(UUID companyId, SubscriptionOrder order, UUID actor) {
        Plan plan = plans.findById(order.planId()).orElseThrow(() -> ApiException.notFound("Paket bulunamadı."));
        LocalDate today = LocalDate.now(clock);
        LocalDate startsOn = access.current(companyId)
            .filter(period -> period.stateOn(today) == SubscriptionState.ACTIVE)
            .map(period -> period.getEndsOn().plusDays(1))
            .orElse(order.startsOn() == null ? today : order.startsOn());
        LocalDate endsOn = startsOn.plusMonths(order.months()).minusDays(1);
        Subscription period = subscriptions.save(new Subscription(companyId, plan,
            new SubscriptionPeriod(startsOn, endsOn, order.note()), actor, clock.instant()));
        access.evict(companyId);
        return period;
    }

    @Transactional
    public Subscription startOnDefaultPlan(UUID companyId, int months, String note) {
        Plan plan = plans.findByCode(DEFAULT_PLAN).orElseThrow(() -> new IllegalStateException("Varsayılan paket yok"));
        return extend(companyId, new SubscriptionOrder(plan.getId(), months, null, note), null);
    }

    @Transactional
    public Subscription changePlan(UUID companyId, UUID subscriptionId, UUID planId) {
        Plan plan = plans.findById(planId).orElseThrow(() -> ApiException.notFound("Paket bulunamadı."));
        Subscription period = periodOf(companyId, subscriptionId);
        period.changePlan(plan, clock.instant());
        access.evict(companyId);
        return period;
    }

    @Transactional
    public Subscription changeStatus(UUID companyId, UUID subscriptionId, SubscriptionStatus status) {
        Subscription period = periodOf(companyId, subscriptionId);
        period.changeStatus(status, clock.instant());
        access.evict(companyId);
        return period;
    }

    @Transactional
    public Payment recordPayment(UUID companyId, PaymentDraft draft, UUID actor) {
        if (draft.subscriptionId() != null) {
            periodOf(companyId, draft.subscriptionId());
        }
        Instant now = clock.instant();
        return payments.save(new Payment(companyId, draft, actor, now));
    }

    private Subscription periodOf(UUID companyId, UUID subscriptionId) {
        return subscriptions.findById(subscriptionId)
            .filter(period -> period.getCompanyId().equals(companyId))
            .orElseThrow(() -> ApiException.notFound("Abonelik dönemi bulunamadı."));
    }
}
