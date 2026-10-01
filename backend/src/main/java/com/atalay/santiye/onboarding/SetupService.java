package com.atalay.santiye.onboarding;

import com.atalay.santiye.audit.AuditAction;
import com.atalay.santiye.audit.AuditEvent;
import com.atalay.santiye.audit.PlatformAudit;
import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.auth.SignIn;
import com.atalay.santiye.billing.WorkspaceAccess;
import com.atalay.santiye.billing.WorkspaceStatus;
import com.atalay.santiye.common.error.ApiException;
import com.atalay.santiye.company.Company;
import com.atalay.santiye.company.CompanyLogos;
import com.atalay.santiye.company.CompanyProfile;
import com.atalay.santiye.company.CompanyRepository;
import com.atalay.santiye.onboarding.dto.CompleteSetupRequest;
import com.atalay.santiye.onboarding.dto.LogoUploaded;
import com.atalay.santiye.onboarding.dto.SetupCompany;
import com.atalay.santiye.onboarding.dto.SetupInviteView;
import com.atalay.santiye.site.SiteService;
import com.atalay.santiye.site.dto.CreateSiteRequest;
import com.atalay.santiye.user.AppUser;
import com.atalay.santiye.user.UserRole;
import java.time.Clock;
import java.time.Instant;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

/**
 * Kurulum sihirbazı: link geçerliyse firma bilgilerini gösterir; sonunda firmayı günceller, ilk patronu açar (ya da
 * var olan hesabını bağlar), istenirse ilk şantiyeyi kurar ve linki kullanılmış yapar. Hepsi tek işlemde.
 */
@Service
public class SetupService {

    private final OnboardingInvites invites;
    private final SetupOwners owners;
    private final CompanyRepository companies;
    private final CompanyLogos logos;
    private final SiteService sites;
    private final WorkspaceAccess access;
    private final PlatformAudit audit;
    private final Clock clock;

    SetupService(OnboardingInvites invites, SetupOwners owners, CompanyRepository companies, CompanyLogos logos,
        SiteService sites, WorkspaceAccess access, PlatformAudit audit, Clock clock) {
        this.invites = invites;
        this.owners = owners;
        this.companies = companies;
        this.logos = logos;
        this.sites = sites;
        this.access = access;
        this.audit = audit;
        this.clock = clock;
    }

    @Transactional(readOnly = true)
    public SetupInviteView describe(String token) {
        Company company = companyOf(invites.requireUsable(token));
        WorkspaceStatus status = access.statusOf(company.getId());
        return new SetupInviteView(company.getName(), company.getPhone(), company.getEmail(), company.getCity(),
            company.getLogoUrl(), status.planName(), status.endsOn(), status.features().stream().sorted().toList());
    }

    @Transactional
    public LogoUploaded uploadLogo(String token, MultipartFile file) {
        OnboardingInvite invite = invites.requireUsable(token);
        return new LogoUploaded(logos.replace(invite.getCompanyId(), file).getLogoUrl());
    }

    @Transactional
    public SignIn complete(String token, CompleteSetupRequest request) {
        OnboardingInvite invite = invites.lockUsable(token);
        Company company = companyOf(invite);
        Instant now = clock.instant();
        SetupCompany details = request.company();
        company.updateProfile(new CompanyProfile(details.name().trim(), blankToNull(details.phone()),
            blankToNull(details.email()), blankToNull(details.city())), now);
        AppUser owner = owners.ownerOf(company.getId(), request.owner());
        invite.markUsed(owner.getId(), now);
        company.completeSetup(now);
        if (request.firstSite() != null) {
            sites.createSite(new CurrentUser(owner.getId(), company.getId(), UserRole.OWNER, owner.getFullName(), false),
                new CreateSiteRequest(request.firstSite().name().trim(), request.firstSite().address()));
        }
        audit.record(owner.getId(), AuditEvent.of(AuditAction.SETUP_COMPLETED, company.getId(),
            company.getName() + " kurulumu tamamladı (" + owner.getFullName() + ")"));
        access.evict(company.getId());
        return new SignIn(owner, company.getId());
    }

    private Company companyOf(OnboardingInvite invite) {
        return companies.findById(invite.getCompanyId()).orElseThrow(() -> ApiException.notFound("Firma bulunamadı."));
    }

    private static String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
