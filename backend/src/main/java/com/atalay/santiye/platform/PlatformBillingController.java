package com.atalay.santiye.platform;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.platform.dto.ChangePlanRequest;
import com.atalay.santiye.platform.dto.ChangeSubscriptionStatusRequest;
import com.atalay.santiye.platform.dto.ExtendSubscriptionRequest;
import com.atalay.santiye.platform.dto.PaymentRequest;
import com.atalay.santiye.platform.dto.TenantDetail;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Platform yönetimi: bir firmanın abonelik dönemleri ve ödemeleri. Her cevap güncel firma ayrıntısıdır. */
@RestController
@RequestMapping("/platform/tenants/{companyId}")
@Tag(name = "Platform")
public class PlatformBillingController {

    private final PlatformBilling billing;
    private final PlatformTenantQueries queries;

    PlatformBillingController(PlatformBilling billing, PlatformTenantQueries queries) {
        this.billing = billing;
        this.queries = queries;
    }

    @PostMapping("/subscriptions")
    public TenantDetail extendSubscription(@AuthenticationPrincipal CurrentUser admin, @PathVariable UUID companyId,
        @Valid @RequestBody ExtendSubscriptionRequest request) {
        billing.extend(companyId, request, admin.userId());
        return queries.detail(companyId);
    }

    @PostMapping("/subscriptions/{subscriptionId}/plan")
    public TenantDetail changeSubscriptionPlan(@AuthenticationPrincipal CurrentUser admin, @PathVariable UUID companyId,
        @PathVariable UUID subscriptionId, @Valid @RequestBody ChangePlanRequest request) {
        billing.changePlan(companyId, subscriptionId, request.planId(), admin.userId());
        return queries.detail(companyId);
    }

    @PostMapping("/subscriptions/{subscriptionId}/status")
    public TenantDetail changeSubscriptionStatus(@AuthenticationPrincipal CurrentUser admin,
        @PathVariable UUID companyId, @PathVariable UUID subscriptionId,
        @Valid @RequestBody ChangeSubscriptionStatusRequest request) {
        billing.changeStatus(companyId, subscriptionId, request.status(), admin.userId());
        return queries.detail(companyId);
    }

    @PostMapping("/payments")
    public TenantDetail recordPayment(@AuthenticationPrincipal CurrentUser admin, @PathVariable UUID companyId,
        @Valid @RequestBody PaymentRequest request) {
        billing.recordPayment(companyId, request, null, admin.userId());
        return queries.detail(companyId);
    }
}
