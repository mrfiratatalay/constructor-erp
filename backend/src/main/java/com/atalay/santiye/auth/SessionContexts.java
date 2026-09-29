package com.atalay.santiye.auth;

import com.atalay.santiye.auth.dto.SessionContextView;
import com.atalay.santiye.auth.dto.SessionUserView;
import com.atalay.santiye.auth.dto.WorkspaceAccessView;
import com.atalay.santiye.auth.dto.WorkspaceOptionView;
import com.atalay.santiye.auth.dto.WorkspaceView;
import com.atalay.santiye.billing.WorkspaceAccess;
import com.atalay.santiye.billing.WorkspaceStatus;
import com.atalay.santiye.common.error.ApiException;
import com.atalay.santiye.company.Company;
import com.atalay.santiye.company.CompanyRepository;
import com.atalay.santiye.tenant.Membership;
import com.atalay.santiye.tenant.Workspaces;
import com.atalay.santiye.user.AppUser;
import com.atalay.santiye.user.UserRepository;
import java.time.Clock;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Oturumun bağlamı (SessionContextView): kim, hangi firmalarda, şu an hangi firmada ve orası açık mı. */
@Service
public class SessionContexts {

    private final UserRepository users;
    private final CompanyRepository companies;
    private final Workspaces workspaces;
    private final WorkspaceAccess access;
    private final Clock clock;

    SessionContexts(UserRepository users, CompanyRepository companies, Workspaces workspaces, WorkspaceAccess access,
        Clock clock) {
        this.users = users;
        this.companies = companies;
        this.workspaces = workspaces;
        this.access = access;
        this.clock = clock;
    }

    @Transactional(readOnly = true)
    public SessionContextView of(CurrentUser current) {
        AppUser user = users.findById(current.userId()).orElseThrow(() -> ApiException.unauthorized("Oturum geçersiz."));
        List<Membership> memberships = workspaces.activeOf(user.getId());
        Map<UUID, Company> byId = companies.findAllById(memberships.stream().map(Membership::getCompanyId).toList())
            .stream().collect(Collectors.toMap(Company::getId, Function.identity()));
        List<WorkspaceOptionView> options = memberships.stream().filter(m -> byId.containsKey(m.getCompanyId()))
            .map(m -> optionOf(byId.get(m.getCompanyId()), m)).toList();
        WorkspaceView workspace = current.hasWorkspace() && byId.containsKey(current.companyId())
            ? workspaceOf(byId.get(current.companyId()), current) : null;
        return new SessionContextView(new SessionUserView(user.getId(), user.getFullName(), user.getEmail(),
            user.isPlatformAdmin()), options, workspace);
    }

    private WorkspaceView workspaceOf(Company company, CurrentUser current) {
        WorkspaceStatus status = access.statusOf(company.getId());
        return new WorkspaceView(company.getId(), company.getName(), company.getSlug(), company.getLogoUrl(),
            company.getPhone(), company.getEmail(), current.role(), Permission.grantedTo(current.role()),
            status.features().stream().sorted().toList(), accessOf(status));
    }

    private WorkspaceAccessView accessOf(WorkspaceStatus status) {
        Long daysLeft = status.endsOn() == null ? null : ChronoUnit.DAYS.between(LocalDate.now(clock), status.endsOn());
        return new WorkspaceAccessView(status.open(),
            status.lockReason() == null ? null : status.lockReason().name(),
            status.lockReason() == null ? null : status.lockReason().message(),
            status.planName(), status.subscriptionState() == null ? null : status.subscriptionState().name(),
            status.endsOn(), daysLeft);
    }

    private static WorkspaceOptionView optionOf(Company company, Membership membership) {
        return new WorkspaceOptionView(company.getId(), company.getName(), company.getLogoUrl(), membership.getRole());
    }
}
