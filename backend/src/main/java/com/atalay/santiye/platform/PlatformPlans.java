package com.atalay.santiye.platform;

import com.atalay.santiye.audit.AuditAction;
import com.atalay.santiye.audit.AuditEvent;
import com.atalay.santiye.audit.PlatformAudit;
import com.atalay.santiye.billing.FeatureInfo;
import com.atalay.santiye.billing.Plan;
import com.atalay.santiye.billing.PlanCatalog;
import com.atalay.santiye.billing.PlanRepository;
import com.atalay.santiye.billing.PlanTerms;
import com.atalay.santiye.billing.WorkspaceAccess;
import com.atalay.santiye.common.error.ApiException;
import com.atalay.santiye.platform.dto.PlanAdminView;
import com.atalay.santiye.platform.dto.TenantRow;
import com.atalay.santiye.platform.dto.UpdatePlanRequest;
import java.time.Clock;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Paket yönetimi: fiyat, sınırlar, görünürlük ve açtığı modüller. Kodda sabit fiyat yoktur. */
@Service
public class PlatformPlans {

    private final PlanRepository plans;
    private final PlanCatalog catalog;
    private final TenantRows rows;
    private final WorkspaceAccess access;
    private final PlatformAudit audit;
    private final Clock clock;

    PlatformPlans(PlanRepository plans, PlanCatalog catalog, TenantRows rows, WorkspaceAccess access,
        PlatformAudit audit, Clock clock) {
        this.plans = plans;
        this.catalog = catalog;
        this.rows = rows;
        this.access = access;
        this.audit = audit;
        this.clock = clock;
    }

    @Transactional(readOnly = true)
    public List<PlanAdminView> list() {
        Map<UUID, Set<String>> enabled = catalog.enabledByPlan();
        Map<String, Long> openByPlan = rows.all().stream().filter(row -> row.open() && row.planName() != null)
            .collect(Collectors.groupingBy(TenantRow::planName, Collectors.counting()));
        return plans.findAllByOrderBySortOrder().stream().map(plan -> new PlanAdminView(plan.getId(), plan.getCode(),
            plan.getName(), plan.getTagline(), plan.getMonthlyPrice(), plan.getCurrency(), plan.getMaxUsers(),
            plan.getMaxSites(), plan.isHighlighted(), plan.isVisible(), plan.getStatus().name(),
            enabled.getOrDefault(plan.getId(), Set.of()).stream().sorted().toList(),
            openByPlan.getOrDefault(plan.getName(), 0L))).toList();
    }

    public List<FeatureInfo> features() {
        return catalog.features();
    }

    /** Modüller değişince bütün firmaların erişim önbelleği silinir: değişiklik hemen geçerli olur. */
    @Transactional
    public void update(UUID planId, UpdatePlanRequest request, UUID actor) {
        Plan plan = plans.findById(planId).orElseThrow(() -> ApiException.notFound("Paket bulunamadı."));
        plan.update(new PlanTerms(request.name().trim(), request.tagline(), request.monthlyPrice(), request.maxUsers(),
            request.maxSites(), request.highlighted(), request.visible(), request.status()), clock.instant());
        catalog.setFeatures(planId, request.features());
        access.evictAll();
        audit.record(actor, AuditEvent.of(AuditAction.PLAN_UPDATED, null, plan.getName() + " paketi güncellendi")
            .with(Map.of("features", request.features(), "price", String.valueOf(request.monthlyPrice()))));
    }
}
