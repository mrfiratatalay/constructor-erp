package com.atalay.santiye.onboarding;

import com.atalay.santiye.common.error.ApiException;
import com.atalay.santiye.common.web.AttemptCounter;
import com.atalay.santiye.onboarding.dto.SetupOwner;
import com.atalay.santiye.team.PersonNames;
import com.atalay.santiye.tenant.Membership;
import com.atalay.santiye.tenant.MembershipRepository;
import com.atalay.santiye.user.AppUser;
import com.atalay.santiye.user.UserRepository;
import com.atalay.santiye.user.UserRole;
import java.nio.charset.StandardCharsets;
import java.time.Clock;
import java.time.Duration;
import java.util.UUID;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Kurulumdaki ilk patron. E-posta yeni ise hesap açılır; başka bir firmada kayıtlı bir hesabınsa şifre doğrulanır
 * ve aynı kişi bu firmaya da patron olarak bağlanır (bir kişi birden çok firmada olabilir). Kurulum linki elinde
 * olan biri burada var olan hesapların şifresini deneyebileceği için hatalı denemeler firma başına sınırlıdır.
 */
@Component
class SetupOwners {

    private static final int FAILED_LIMIT = 10;
    private static final Duration WINDOW = Duration.ofMinutes(15);
    /** bcrypt şifrenin yalnızca ilk 72 baytını kullanır ve daha uzununu kaydetmeyi reddeder; Türkçe harf iki bayttır. */
    private static final int MAX_PASSWORD_BYTES = 72;

    private final UserRepository users;
    private final MembershipRepository memberships;
    private final PasswordEncoder passwordEncoder;
    private final AttemptCounter failures;
    private final Clock clock;

    SetupOwners(UserRepository users, MembershipRepository memberships, PasswordEncoder passwordEncoder, Clock clock) {
        this.users = users;
        this.memberships = memberships;
        this.passwordEncoder = passwordEncoder;
        this.failures = new AttemptCounter(FAILED_LIMIT, WINDOW, clock);
        this.clock = clock;
    }

    AppUser ownerOf(UUID companyId, SetupOwner request) {
        String email = request.email().trim();
        AppUser owner = users.findByEmailIgnoreCase(email)
            .map(existing -> verified(companyId.toString(), existing, request.password()))
            .orElseGet(() -> newOwner(request, email));
        Membership membership = memberships.findByCompanyIdAndUserId(companyId, owner.getId())
            .orElseGet(() -> new Membership(companyId, owner.getId(), UserRole.OWNER, clock.instant()));
        membership.changeRole(UserRole.OWNER);
        membership.setActive(true);
        memberships.save(membership);
        return owner;
    }

    private AppUser verified(String company, AppUser existing, String password) {
        if (failures.isExhausted(company)) {
            throw ApiException.tooManyRequests("Çok fazla hatalı şifre denemesi. 15 dakika sonra tekrar deneyin.");
        }
        if (!existing.canLoginWithPassword() || !passwordEncoder.matches(password, existing.getPasswordHash())) {
            failures.record(company);
            throw ApiException.badRequest("Bu e-posta ile kayıtlı bir hesap var. O hesabın şifresini yazın ya da "
                + "başka bir e-posta kullanın.");
        }
        return existing;
    }

    private AppUser newOwner(SetupOwner request, String email) {
        if (request.password().getBytes(StandardCharsets.UTF_8).length > MAX_PASSWORD_BYTES) {
            throw ApiException.badRequest("Şifre en çok 72 karakter olabilir; Türkçe harfler (ç, ğ, ı, ö, ş, ü) iki "
                + "karakter sayılır.");
        }
        AppUser owner = new AppUser(PersonNames.tidy(request.fullName()), clock.instant());
        owner.setPasswordLogin(email, passwordEncoder.encode(request.password()));
        return users.save(owner);
    }
}
