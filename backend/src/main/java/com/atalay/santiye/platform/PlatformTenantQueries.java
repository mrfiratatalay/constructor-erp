package com.atalay.santiye.platform;

import com.atalay.santiye.billing.Periods;
import com.atalay.santiye.billing.Subscription;
import com.atalay.santiye.billing.SubscriptionRepository;
import com.atalay.santiye.billing.WorkspaceAccess;
import com.atalay.santiye.billing.WorkspaceStatus;
import com.atalay.santiye.common.error.ApiException;
import com.atalay.santiye.company.Company;
import com.atalay.santiye.company.CompanyRepository;
import com.atalay.santiye.platform.dto.PaymentView;
import com.atalay.santiye.platform.dto.SubscriptionView;
import com.atalay.santiye.platform.dto.TenantDetail;
import com.atalay.santiye.platform.dto.TenantMemberRow;
import com.atalay.santiye.platform.dto.TenantRow;
import java.time.Clock;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.function.Function;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Platform yönetiminin firma okumaları: liste, ayrıntı (dönemler, ödemeler), kişiler. */
@Service
public class PlatformTenantQueries {

    private final TenantRows rows;
    private final CompanyRepository companies;
    private final SubscriptionRepository subscriptions;
    private final WorkspaceAccess access;
    private final JdbcClient jdbc;
    private final Clock clock;

    PlatformTenantQueries(TenantRows rows, CompanyRepository companies, SubscriptionRepository subscriptions,
        WorkspaceAccess access, JdbcClient jdbc, Clock clock) {
        this.rows = rows;
        this.companies = companies;
        this.subscriptions = subscriptions;
        this.access = access;
        this.jdbc = jdbc;
        this.clock = clock;
    }

    public List<TenantRow> list() {
        return rows.all();
    }

    @Transactional(readOnly = true)
    public TenantDetail detail(UUID companyId) {
        Company company = companies.findById(companyId).orElseThrow(() -> ApiException.notFound("Firma bulunamadı."));
        TenantRow summary = rows.one(companyId).orElseThrow(() -> ApiException.notFound("Firma bulunamadı."));
        List<Subscription> periods = subscriptions.findByCompanyIdOrderByStartsOnDesc(companyId);
        Function<UUID, String> planName = TenantRows.names(rows.planNames());
        String currentId = Periods.current(periods, LocalDate.now(clock)).map(period -> period.getId().toString())
            .orElse(null);
        WorkspaceStatus status = access.statusOf(companyId);
        return new TenantDetail(summary, company.getPhone(), company.getEmail(), company.getLogoUrl(),
            status.lockReason() == null ? null : status.lockReason().name(), currentId,
            periods.stream().map(period -> viewOf(period, planName)).toList(), payments(companyId));
    }

    @Transactional(readOnly = true)
    public List<TenantMemberRow> members(UUID companyId) {
        return jdbc.sql("""
            select u.id as user_id, u.full_name, u.phone, u.email, m.role, m.active, m.created_at,
                   (select max(s.last_seen_at) from user_sessions s where s.user_id = u.id and s.company_id = m.company_id)
                   as last_seen_at
            from company_memberships m join users u on u.id = m.user_id
            where m.company_id = :company order by m.active desc, u.full_name""")
            .param("company", companyId).query(TenantMemberRow.class).list();
    }

    private List<PaymentView> payments(UUID companyId) {
        return jdbc.sql("""
            select p.id, p.subscription_id, p.amount, p.currency, p.method, p.paid_on, p.description,
                   u.full_name as created_by_name
            from payments p left join users u on u.id = p.created_by
            where p.company_id = :company order by p.paid_on desc, p.created_at desc""")
            .param("company", companyId).query(PaymentView.class).list();
    }

    private SubscriptionView viewOf(Subscription period, Function<UUID, String> planName) {
        return new SubscriptionView(period.getId(), period.getPlanId(), planName.apply(period.getPlanId()),
            period.getStatus().name(), period.stateOn(LocalDate.now(clock)).name(), period.getStartsOn(),
            period.getEndsOn(), period.getPriceSnapshot(), period.getCurrency(), period.getNote(), period.getCreatedAt());
    }
}
