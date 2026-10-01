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
import java.util.Locale;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository users;
    private final CompanyRepository companies;
    private final Workspaces workspaces;
    private final WorkspaceAccess access;
    private final PasswordCheck passwords;
    private final LoginAttempts attempts;

    AuthService(UserRepository users, CompanyRepository companies, Workspaces workspaces, WorkspaceAccess access,
        PasswordCheck passwords, LoginAttempts attempts) {
        this.users = users;
        this.companies = companies;
        this.workspaces = workspaces;
        this.access = access;
        this.passwords = passwords;
        this.attempts = attempts;
    }

    /**
     * Hata mesajı ve süresi bilerek aynı: hangi e-postanın kayıtlı olduğunu dışarıya belli etmeyiz (PasswordCheck).
     * Çok hatalı deneme 429 alır (LoginAttempts). Oturum kişinin en eski aktif üyeliğinin firmasında açılır; platform
     * yöneticisi firmasız da girer.
     */
    @Transactional(readOnly = true)
    public SignIn login(String email, String password, String clientAddress) {
        String account = email.trim().toLowerCase(Locale.ROOT);
        attempts.requireAllowed(clientAddress, account);
        AppUser user = users.findByEmailIgnoreCase(email.trim()).orElse(null);
        if (!passwords.matches(user, password)) {
            attempts.failed(clientAddress, account);
            throw ApiException.unauthorized("E-posta ya da şifre hatalı.");
        }
        attempts.succeeded(clientAddress, account);
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
