package com.atalay.santiye.platform;

import com.atalay.santiye.audit.AuditEntryView;
import com.atalay.santiye.audit.PlatformAudit;
import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.platform.dto.ChangeTenantStatusRequest;
import com.atalay.santiye.platform.dto.CreateTenantRequest;
import com.atalay.santiye.platform.dto.TenantCreated;
import com.atalay.santiye.platform.dto.TenantDetail;
import com.atalay.santiye.platform.dto.TenantMemberRow;
import com.atalay.santiye.platform.dto.TenantRow;
import com.atalay.santiye.platform.dto.UpdateTenantRequest;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/** Platform yönetimi: firmalar (tenant). Yalnızca SUPER_ADMIN (SecurityConfig, /api/platform/**). */
@RestController
@RequestMapping("/platform/tenants")
@Tag(name = "Platform")
public class PlatformTenantController {

    private final PlatformTenantQueries queries;
    private final PlatformTenants tenants;
    private final PlatformAudit audit;

    PlatformTenantController(PlatformTenantQueries queries, PlatformTenants tenants, PlatformAudit audit) {
        this.queries = queries;
        this.tenants = tenants;
        this.audit = audit;
    }

    @GetMapping
    public List<TenantRow> listTenants() {
        return queries.list();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TenantCreated createTenant(@AuthenticationPrincipal CurrentUser admin,
        @Valid @RequestBody CreateTenantRequest request) {
        return tenants.create(request, admin.userId());
    }

    @GetMapping("/{companyId}")
    public TenantDetail getTenant(@PathVariable UUID companyId) {
        return queries.detail(companyId);
    }

    @PutMapping("/{companyId}")
    public TenantDetail updateTenant(@AuthenticationPrincipal CurrentUser admin, @PathVariable UUID companyId,
        @Valid @RequestBody UpdateTenantRequest request) {
        tenants.update(companyId, request, admin.userId());
        return queries.detail(companyId);
    }

    @PostMapping("/{companyId}/status")
    public TenantDetail changeTenantStatus(@AuthenticationPrincipal CurrentUser admin, @PathVariable UUID companyId,
        @Valid @RequestBody ChangeTenantStatusRequest request) {
        tenants.changeStatus(companyId, request, admin.userId());
        return queries.detail(companyId);
    }

    @GetMapping("/{companyId}/members")
    public List<TenantMemberRow> listTenantMembers(@PathVariable UUID companyId) {
        return queries.members(companyId);
    }

    @GetMapping("/{companyId}/audit")
    public List<AuditEntryView> listTenantAudit(@PathVariable UUID companyId) {
        return audit.ofCompany(companyId);
    }
}
