package com.atalay.santiye.auth;

import com.atalay.santiye.auth.dto.CurrentUserResponse;
import com.atalay.santiye.common.error.ApiException;
import com.atalay.santiye.company.Company;
import com.atalay.santiye.company.CompanyRepository;
import com.atalay.santiye.user.AppUser;
import com.atalay.santiye.user.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository users;
    private final CompanyRepository companies;
    private final PasswordEncoder passwordEncoder;

    AuthService(UserRepository users, CompanyRepository companies, PasswordEncoder passwordEncoder) {
        this.users = users;
        this.companies = companies;
        this.passwordEncoder = passwordEncoder;
    }

    /** Hata mesajı bilerek aynı: hangi e-postanın kayıtlı olduğunu dışarıya belli etmeyiz. */
    @Transactional(readOnly = true)
    public AppUser login(String email, String password) {
        return users.findByEmailIgnoreCase(email.trim())
            .filter(AppUser::canLoginWithPassword)
            .filter(user -> passwordEncoder.matches(password, user.getPasswordHash()))
            .orElseThrow(() -> ApiException.unauthorized("E-posta ya da şifre hatalı."));
    }

    @Transactional(readOnly = true)
    public CurrentUserResponse describe(AppUser user) {
        String companyName = companies.findById(user.getCompanyId()).map(Company::getName).orElse("");
        return new CurrentUserResponse(user.getId(), user.getFullName(), user.getRole(), companyName);
    }

    @Transactional(readOnly = true)
    public CurrentUserResponse describe(CurrentUser current) {
        return users.findById(current.userId())
            .map(this::describe)
            .orElseThrow(() -> ApiException.unauthorized("Oturum geçersiz."));
    }
}
