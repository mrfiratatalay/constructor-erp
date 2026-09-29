package com.atalay.santiye.platform;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.billing.FeatureInfo;
import com.atalay.santiye.platform.dto.PlanAdminView;
import com.atalay.santiye.platform.dto.UpdatePlanRequest;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/platform")
@Tag(name = "Platform")
public class PlatformPlanController {

    private final PlatformPlans plans;

    PlatformPlanController(PlatformPlans plans) {
        this.plans = plans;
    }

    @GetMapping("/plans")
    public List<PlanAdminView> listPlans() {
        return plans.list();
    }

    @GetMapping("/features")
    public List<FeatureInfo> listFeatures() {
        return plans.features();
    }

    @PutMapping("/plans/{planId}")
    public List<PlanAdminView> updatePlan(@AuthenticationPrincipal CurrentUser admin, @PathVariable UUID planId,
        @Valid @RequestBody UpdatePlanRequest request) {
        plans.update(planId, request, admin.userId());
        return plans.list();
    }
}
