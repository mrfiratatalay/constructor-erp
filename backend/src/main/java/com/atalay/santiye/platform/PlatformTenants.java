package com.atalay.santiye.platform;

import com.atalay.santiye.audit.AuditAction;
import com.atalay.santiye.audit.AuditEvent;
import com.atalay.santiye.audit.PlatformAudit;
import com.atalay.santiye.billing.Subscription;
import com.atalay.santiye.billing.SubscriptionOrder;
import com.atalay.santiye.billing.WorkspaceAccess;
import com.atalay.santiye.common.error.ApiException;
import com.atalay.santiye.company.Company;
import com.atalay.santiye.company.CompanyProfile;
import com.atalay.santiye.company.CompanyRepository;
import com.atalay.santiye.company.CompanySlugs;
import com.atalay.santiye.lead.SalesRequests;
import com.atalay.santiye.onboarding.OnboardingInvites;
import com.atalay.santiye.onboarding.dto.OnboardingLink;
import com.atalay.santiye.platform.dto.ChangeTenantStatusRequest;
import com.atalay.santiye.platform.dto.CreateTenantRequest;
import com.atalay.santiye.platform.dto.TenantCreated;
import com.atalay.santiye.platform.dto.UpdateTenantRequest;
import java.time.Clock;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Firmanın (tenant) yaşamı, platform tarafından: aç (manuel satış), bilgilerini düzelt, askıya al / arşivle / yeniden
 * aç. Silme yoktur. Her işlem platform işlem geçmişine yazılır.
 */
@Service
public class PlatformTenants {

    private final CompanyRepository companies;
    private final CompanySlugs slugs;
    private final PlatformBilling billing;
    private final OnboardingInvites invites;
    private final SalesRequests salesRequests;
    private final WorkspaceAccess access;
    private final PlatformAudit audit;
    private final Clock clock;

    PlatformTenants(CompanyRepository companies, CompanySlugs slugs, PlatformBilling billing, OnboardingInvites invites,
        SalesRequests salesRequests, WorkspaceAccess access, PlatformAudit audit, Clock clock) {
        this.companies = companies;
        this.slugs = slugs;
        this.billing = billing;
        this.invites = invites;
        this.salesRequests = salesRequests;
        this.access = access;
        this.audit = audit;
        this.clock = clock;
    }

    /** Tenant oluştur → paket ve dönem → (ödeme) → (başvuruyu kazanıldı yap) → kurulum linki. Hepsi ya olur ya hiç. */
    @Transactional
    public TenantCreated create(CreateTenantRequest request, UUID actor) {
        Instant now = clock.instant();
        String name = request.name().trim();
        Company company = new Company(name, slugs.uniqueFor(name), now);
        company.updateProfile(new CompanyProfile(name, blankToNull(request.phone()), blankToNull(request.email()),
            blankToNull(request.city())), now);
        companies.save(company);
        audit.record(actor, AuditEvent.of(AuditAction.TENANT_CREATED, company.getId(), name + " firması açıldı")
            .with(Map.of("slug", company.getSlug())));
        Subscription period = billing.startPeriod(company.getId(),
            new SubscriptionOrder(request.planId(), request.months(), request.startsOn(), "İlk dönem"), actor);
        if (request.payment() != null) {
            billing.recordPayment(company.getId(), request.payment(), period.getId(), actor);
        }
        if (request.salesRequestId() != null) {
            salesRequests.convert(request.salesRequestId(), company.getId());
        }
        OnboardingLink invite = invites.issue(company.getId(), actor);
        return new TenantCreated(company.getId(), invite);
    }

    @Transactional
    public void update(UUID companyId, UpdateTenantRequest request, UUID actor) {
        Company company = require(companyId);
        company.updateProfile(new CompanyProfile(request.name().trim(), blankToNull(request.phone()),
            blankToNull(request.email()), blankToNull(request.city())), clock.instant());
        audit.record(actor, AuditEvent.of(AuditAction.TENANT_UPDATED, companyId, "Firma bilgileri güncellendi"));
    }

    /** Askıya alınan ya da arşivlenen firmanın çalışma alanı hemen kilitlenir; veri durur, geri açılabilir. */
    @Transactional
    public void changeStatus(UUID companyId, ChangeTenantStatusRequest request, UUID actor) {
        Company company = require(companyId);
        Map<String, Object> details = new HashMap<>();
        details.put("from", company.getStatus().name());
        details.put("to", request.status().name());
        details.put("reason", request.reason());
        company.changeStatus(request.status(), clock.instant());
        access.evict(companyId);
        audit.record(actor, AuditEvent.of(AuditAction.TENANT_STATUS_CHANGED, companyId,
            "Firma durumu: " + StatusNames.of(request.status())).with(details));
    }

    private Company require(UUID companyId) {
        return companies.findById(companyId).orElseThrow(() -> ApiException.notFound("Firma bulunamadı."));
    }

    private static String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
