package com.atalay.santiye.billing;

import com.atalay.santiye.billing.dto.PlanFeatureView;
import com.atalay.santiye.billing.dto.PublicPlanView;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Tanıtım sitesinin paketleri: yalnızca satışta ve görünür olanlar, modül karşılaştırmasıyla. Fiyat veridir. */
@Service
public class PublicPlans {

    private final PlanRepository plans;
    private final PlanCatalog catalog;

    PublicPlans(PlanRepository plans, PlanCatalog catalog) {
        this.plans = plans;
        this.catalog = catalog;
    }

    @Transactional(readOnly = true)
    public List<PublicPlanView> list() {
        List<FeatureInfo> features = catalog.features();
        Map<UUID, Set<String>> enabled = catalog.enabledByPlan();
        return plans.findAllByOrderBySortOrder().stream()
            .filter(plan -> plan.getStatus() == PlanStatus.ACTIVE && plan.isVisible())
            .map(plan -> viewOf(plan, features, enabled.getOrDefault(plan.getId(), Set.of()))).toList();
    }

    private static PublicPlanView viewOf(Plan plan, List<FeatureInfo> features, Set<String> enabled) {
        List<PlanFeatureView> comparison = features.stream()
            .map(f -> new PlanFeatureView(f.key(), f.name(), f.description(), enabled.contains(f.key()))).toList();
        return new PublicPlanView(plan.getId(), plan.getCode(), plan.getName(), plan.getTagline(),
            plan.getMonthlyPrice(), plan.getCurrency(), plan.getMaxUsers(), plan.getMaxSites(), plan.isHighlighted(),
            comparison);
    }
}
