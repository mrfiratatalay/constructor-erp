package com.atalay.santiye.onboarding;

import com.atalay.santiye.common.error.ApiException;
import com.atalay.santiye.onboarding.dto.SetupOwner;
import com.atalay.santiye.team.PersonNames;
import com.atalay.santiye.tenant.Membership;
import com.atalay.santiye.tenant.MembershipRepository;
import com.atalay.santiye.user.AppUser;
import com.atalay.santiye.user.UserRepository;
import com.atalay.santiye.user.UserRole;
import java.time.Clock;
import java.util.UUID;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Kurulumdaki ilk patron. E-posta yeni ise hesap açılır; başka bir firmada kayıtlı bir hesabınsa şifre doğrulanır
 * ve aynı kişi bu firmaya da patron olarak bağlanır (bir kişi birden çok firmada olabilir).
 */
@Component
class SetupOwners {

    private final UserRepository users;
    private final MembershipRepository memberships;
    private final PasswordEncoder passwordEncoder;
    private final Clock clock;

    SetupOwners(UserRepository users, MembershipRepository memberships, PasswordEncoder passwordEncoder, Clock clock) {
        this.users = users;
        this.memberships = memberships;
        this.passwordEncoder = passwordEncoder;
        this.clock = clock;
    }

    AppUser ownerOf(UUID companyId, SetupOwner request) {
        String email = request.email().trim();
        AppUser owner = users.findByEmailIgnoreCase(email).map(existing -> verified(existing, request.password()))
            .orElseGet(() -> newOwner(request, email));
        Membership membership = memberships.findByCompanyIdAndUserId(companyId, owner.getId())
            .orElseGet(() -> new Membership(companyId, owner.getId(), UserRole.OWNER, clock.instant()));
        membership.changeRole(UserRole.OWNER);
        membership.setActive(true);
        memberships.save(membership);
        return owner;
    }

    private AppUser verified(AppUser existing, String password) {
        if (!existing.canLoginWithPassword() || !passwordEncoder.matches(password, existing.getPasswordHash())) {
            throw ApiException.badRequest("Bu e-posta ile kayıtlı bir hesap var. O hesabın şifresini yazın ya da "
                + "başka bir e-posta kullanın.");
        }
        return existing;
    }

    private AppUser newOwner(SetupOwner request, String email) {
        AppUser owner = new AppUser(PersonNames.tidy(request.fullName()), clock.instant());
        owner.setPasswordLogin(email, passwordEncoder.encode(request.password()));
        return users.save(owner);
    }
}
