package com.atalay.santiye.platform;

import com.atalay.santiye.audit.PlatformAudit;
import com.atalay.santiye.billing.Periods;
import com.atalay.santiye.billing.Subscription;
import com.atalay.santiye.billing.SubscriptionRepository;
import com.atalay.santiye.billing.SubscriptionState;
import com.atalay.santiye.lead.SalesRequests;
import com.atalay.santiye.platform.dto.MonthlyAmount;
import com.atalay.santiye.platform.dto.PlatformDashboardView;
import com.atalay.santiye.platform.dto.TenantRow;
import java.math.BigDecimal;
import java.sql.Date;
import java.time.Clock;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Platformun özet ekranı: firma sayıları, tahsilat, tekrarlayan gelir, yakında bitecek abonelikler, son işlemler. */
@Service
public class PlatformDashboard {

    private static final int EXPIRING_DAYS = 14;
    private static final int MONTHS = 6;

    private final TenantRows rows;
    private final SubscriptionRepository subscriptions;
    private final SalesRequests salesRequests;
    private final PlatformAudit audit;
    private final JdbcClient jdbc;
    private final Clock clock;

    PlatformDashboard(TenantRows rows, SubscriptionRepository subscriptions, SalesRequests salesRequests,
        PlatformAudit audit, JdbcClient jdbc, Clock clock) {
        this.rows = rows;
        this.subscriptions = subscriptions;
        this.salesRequests = salesRequests;
        this.audit = audit;
        this.jdbc = jdbc;
        this.clock = clock;
    }

    @Transactional(readOnly = true)
    public PlatformDashboardView summary() {
        List<TenantRow> tenants = rows.all();
        YearMonth thisMonth = YearMonth.now(clock);
        List<MonthlyAmount> collections = collections(thisMonth);
        return new PlatformDashboardView(
            tenants.stream().filter(TenantRow::open).count(),
            tenants.stream().filter(row -> "ACTIVE".equals(row.status()) && !row.open()).count(),
            tenants.stream().filter(row -> !"ACTIVE".equals(row.status())).count(),
            tenants.stream().filter(row -> YearMonth.from(row.createdAt().atZone(clock.getZone())).equals(thisMonth))
                .count(),
            tenants.stream().filter(row -> !row.setupCompleted()).count(),
            tenants.stream().mapToLong(TenantRow::userCount).sum(),
            collections.getLast().amount(), monthlyRecurring(), salesRequests.countNew(), collections,
            expiringSoon(tenants), audit.recent(8));
    }

    private List<TenantRow> expiringSoon(List<TenantRow> tenants) {
        return tenants.stream()
            .filter(row -> row.open() && row.daysLeft() != null && row.daysLeft() <= EXPIRING_DAYS)
            .sorted(Comparator.comparing(TenantRow::daysLeft)).toList();
    }

    private BigDecimal monthlyRecurring() {
        LocalDate today = LocalDate.now(clock);
        return subscriptions.findAll().stream().collect(Collectors.groupingBy(Subscription::getCompanyId)).values()
            .stream().map(periods -> Periods.current(periods, today).orElse(null)).filter(Objects::nonNull)
            .filter(period -> period.stateOn(today) == SubscriptionState.ACTIVE)
            .map(Subscription::getPriceSnapshot).filter(Objects::nonNull)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    /** Son altı ayın tahsilatı; ödeme olmayan ay sıfırdır, grafikte boşluk kalmaz. */
    private List<MonthlyAmount> collections(YearMonth thisMonth) {
        YearMonth first = thisMonth.minusMonths(MONTHS - 1L);
        Map<String, BigDecimal> byMonth = jdbc.sql("""
            select to_char(paid_on, 'YYYY-MM') as month, sum(amount) as amount from payments
            where paid_on >= :from group by 1""")
            .param("from", Date.valueOf(first.atDay(1))).query(MonthlyAmount.class).list().stream()
            .collect(Collectors.toMap(MonthlyAmount::month, MonthlyAmount::amount));
        return IntStream.range(0, MONTHS).mapToObj(first::plusMonths).map(YearMonth::toString)
            .map(month -> new MonthlyAmount(month, byMonth.getOrDefault(month, BigDecimal.ZERO))).toList();
    }
}
