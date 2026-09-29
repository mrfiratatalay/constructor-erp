package com.atalay.santiye.platform;

import com.atalay.santiye.billing.Periods;
import com.atalay.santiye.billing.Plan;
import com.atalay.santiye.billing.PlanRepository;
import com.atalay.santiye.billing.Subscription;
import com.atalay.santiye.billing.SubscriptionRepository;
import com.atalay.santiye.billing.SubscriptionState;
import com.atalay.santiye.platform.dto.TenantRow;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Firma listesinin satırları: sayımlar tek sorguda, abonelik dönemleri toplu okunup bellekte eşleşir. Platform
 * uçları firma bağlamı dışında çalışır (RLS kısıtı yok); sorgu bütün firmaları bilerek okur.
 */
@Component
class TenantRows {

    private static final String STATS = """
        select c.id, c.name, c.slug, c.status, c.city, c.created_at, c.setup_completed_at is not null as setup_completed,
               (select count(*) from company_memberships m where m.company_id = c.id and m.active) as user_count,
               (select count(*) from sites s where s.company_id = c.id) as site_count,
               (select max(us.last_seen_at) from user_sessions us where us.company_id = c.id) as last_activity_at
        from companies c
        """;

    private record Stats(UUID id, String name, String slug, String status, String city, Instant createdAt,
        boolean setupCompleted, long userCount, long siteCount, Instant lastActivityAt) {
    }

    private final JdbcClient jdbc;
    private final SubscriptionRepository subscriptions;
    private final PlanRepository plans;
    private final Clock clock;

    TenantRows(JdbcClient jdbc, SubscriptionRepository subscriptions, PlanRepository plans, Clock clock) {
        this.jdbc = jdbc;
        this.subscriptions = subscriptions;
        this.plans = plans;
        this.clock = clock;
    }

    @Transactional(readOnly = true)
    List<TenantRow> all() {
        Map<UUID, List<Subscription>> periods = subscriptions.findAll().stream()
            .collect(Collectors.groupingBy(Subscription::getCompanyId));
        Map<UUID, String> planNames = planNames();
        return jdbc.sql(STATS + "order by c.created_at desc").query(Stats.class).list().stream()
            .map(stats -> rowOf(stats, periods.getOrDefault(stats.id(), List.of()), planNames)).toList();
    }

    @Transactional(readOnly = true)
    Optional<TenantRow> one(UUID companyId) {
        return jdbc.sql(STATS + "where c.id = :id").param("id", companyId).query(Stats.class).optional()
            .map(stats -> rowOf(stats, subscriptions.findByCompanyIdOrderByStartsOnDesc(companyId), planNames()));
    }

    Map<UUID, String> planNames() {
        return plans.findAll().stream().collect(Collectors.toMap(Plan::getId, Plan::getName));
    }

    private TenantRow rowOf(Stats stats, List<Subscription> periods, Map<UUID, String> planNames) {
        LocalDate today = LocalDate.now(clock);
        Optional<Subscription> current = Periods.current(periods, today);
        SubscriptionState state = current.map(period -> period.stateOn(today)).orElse(null);
        LocalDate endsOn = current.map(Subscription::getEndsOn).orElse(null);
        return new TenantRow(stats.id(), stats.name(), stats.slug(), stats.status(), stats.city(),
            current.map(period -> planNames.get(period.getPlanId())).orElse(null),
            state == null ? null : state.name(), endsOn,
            endsOn == null ? null : ChronoUnit.DAYS.between(today, endsOn),
            "ACTIVE".equals(stats.status()) && state == SubscriptionState.ACTIVE,
            stats.userCount(), stats.siteCount(), stats.lastActivityAt(), stats.setupCompleted(), stats.createdAt());
    }

    /** Dönem görünümünde kullanılan paket adı sözlüğü; yoksa kimliğin kendisi. */
    static Function<UUID, String> names(Map<UUID, String> planNames) {
        return id -> planNames.getOrDefault(id, id.toString());
    }
}
