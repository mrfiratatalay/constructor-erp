package com.atalay.santiye.auth;

import com.atalay.santiye.auth.dto.CurrentUserResponse;
import com.atalay.santiye.billing.WorkspaceAccess;
import com.atalay.santiye.common.error.ApiException;
import com.atalay.santiye.company.Company;
import com.atalay.santiye.company.CompanyRepository;
import com.atalay.santiye.tenant.Membership;
import com.atalay.santiye.tenant.Workspaces;
import com.atalay.santiye.user.AppUser;
import com.atalay.santiye.user.UserRepository;
import java.util.UUID;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository users;
    private final CompanyRepository companies;
    private final Workspaces workspaces;
    private final WorkspaceAccess access;
    private final PasswordEncoder passwordEncoder;

    AuthService(UserRepository users, CompanyRepository companies, Workspaces workspaces, WorkspaceAccess access,
        PasswordEncoder passwordEncoder) {
        this.users = users;
        this.companies = companies;
        this.workspaces = workspaces;
        this.access = access;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Hata mesajı bilerek aynı: hangi e-postanın kayıtlı olduğunu dışarıya belli etmeyiz. Oturum kişinin en eski
     * aktif üyeliğinin firmasında açılır; platform yöneticisi firmasız da girer.
     */
    @Transactional(readOnly = true)
    public SignIn login(String email, String password) {
        AppUser user = users.findByEmailIgnoreCase(email.trim())
            .filter(AppUser::canLoginWithPassword)
            .filter(candidate -> passwordEncoder.matches(password, candidate.getPasswordHash()))
            .orElseThrow(() -> ApiException.unauthorized("E-posta ya da şifre hatalı."));
        UUID companyId = workspaces.resolve(user.getId(), null).map(Membership::getCompanyId).orElse(null);
        if (companyId == null && !user.isPlatformAdmin()) {
            throw ApiException.unauthorized("Hesabın hiçbir firmada etkin değil. Firmanın yöneticisine başvur.");
        }
        return new SignIn(user, companyId);
    }

    /** Çalışma alanındaki kişi: rolü ve rolün açtığı işler üyelikten gelir. */
    @Transactional(readOnly = true)
    public CurrentUserResponse describe(CurrentUser current) {
        if (!current.hasWorkspace()) {
            throw ApiException.forbidden("Bir firmanın çalışma alanında değilsin.");
        }
        String companyName = companies.findById(current.companyId()).map(Company::getName).orElse("");
        return new CurrentUserResponse(current.userId(), current.fullName(), current.role(), companyName,
            Permission.grantedTo(current.role(), access.statusOf(current.companyId()).features()));
    }
}
