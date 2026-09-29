package com.atalay.santiye.account;

import com.atalay.santiye.account.dto.CompanyPaymentView;
import com.atalay.santiye.account.dto.CompanySubscriptionView;
import com.atalay.santiye.account.dto.PeriodView;
import com.atalay.santiye.billing.FeatureInfo;
import com.atalay.santiye.billing.PaymentRepository;
import com.atalay.santiye.billing.Periods;
import com.atalay.santiye.billing.Plan;
import com.atalay.santiye.billing.PlanCatalog;
import com.atalay.santiye.billing.PlanRepository;
import com.atalay.santiye.billing.Subscription;
import com.atalay.santiye.billing.SubscriptionRepository;
import com.atalay.santiye.billing.dto.PlanFeatureView;
import java.time.Clock;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Patronun abonelik özeti: salt okunur; uzatma ve ödeme Constructor ERP ekibinin işidir. */
@Service
public class AccountSubscriptions {

    private final SubscriptionRepository subscriptions;
    private final PaymentRepository payments;
    private final PlanRepository plans;
    private final PlanCatalog catalog;
    private final JdbcClient jdbc;
    private final Clock clock;

    AccountSubscriptions(SubscriptionRepository subscriptions, PaymentRepository payments, PlanRepository plans,
        PlanCatalog catalog, JdbcClient jdbc, Clock clock) {
        this.subscriptions = subscriptions;
        this.payments = payments;
        this.plans = plans;
        this.catalog = catalog;
        this.jdbc = jdbc;
        this.clock = clock;
    }

    @Transactional(readOnly = true)
    public CompanySubscriptionView of(UUID companyId) {
        LocalDate today = LocalDate.now(clock);
        List<Subscription> periods = subscriptions.findByCompanyIdOrderByStartsOnDesc(companyId);
        Map<UUID, Plan> byId = plans.findAll().stream().collect(Collectors.toMap(Plan::getId, Function.identity()));
        Optional<Subscription> current = Periods.current(periods, today);
        Optional<Plan> plan = current.map(period -> byId.get(period.getPlanId()));
        return new CompanySubscriptionView(plan.map(Plan::getName).orElse(null),
            current.map(period -> period.stateOn(today).name()).orElse(null),
            current.map(Subscription::getStartsOn).orElse(null), current.map(Subscription::getEndsOn).orElse(null),
            current.map(period -> ChronoUnit.DAYS.between(today, period.getEndsOn())).orElse(null),
            current.map(Subscription::getPriceSnapshot).orElse(null),
            count("select count(*) from company_memberships where company_id = :c and active", companyId),
            plan.map(Plan::getMaxUsers).orElse(null),
            count("select count(*) from sites where company_id = :c and status = 'ACTIVE'", companyId),
            plan.map(Plan::getMaxSites).orElse(null), featuresOf(plan), periodViews(periods, byId, today),
            paymentViews(companyId));
    }

    private List<PlanFeatureView> featuresOf(Optional<Plan> plan) {
        Set<String> enabled = plan.map(found -> catalog.enabledFeatures(found.getId())).orElse(Set.of());
        List<FeatureInfo> all = catalog.features();
        return all.stream().map(f -> new PlanFeatureView(f.key(), f.name(), f.description(), enabled.contains(f.key())))
            .toList();
    }

    private static List<PeriodView> periodViews(List<Subscription> periods, Map<UUID, Plan> plans, LocalDate today) {
        return periods.stream().map(period -> new PeriodView(
            Optional.ofNullable(plans.get(period.getPlanId())).map(Plan::getName).orElse(""),
            period.stateOn(today).name(), period.getStartsOn(), period.getEndsOn(), period.getPriceSnapshot())).toList();
    }

    private List<CompanyPaymentView> paymentViews(UUID companyId) {
        return payments.findByCompanyIdOrderByPaidOnDescCreatedAtDesc(companyId).stream()
            .map(p -> new CompanyPaymentView(p.getAmount(), p.getCurrency(), p.getMethod().name(), p.getPaidOn(),
                p.getDescription())).toList();
    }

    private long count(String sql, UUID companyId) {
        return jdbc.sql(sql).param("c", companyId).query(Long.class).single();
    }
}
