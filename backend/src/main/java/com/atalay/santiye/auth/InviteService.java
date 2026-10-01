package com.atalay.santiye.auth;

import com.atalay.santiye.common.error.ApiException;
import com.atalay.santiye.tenant.Workspaces;
import com.atalay.santiye.user.AppUser;
import com.atalay.santiye.user.UserRepository;
import java.time.Clock;
import java.time.Instant;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class InviteService {

    private static final String INVALID_LINK =
        "Bu giriş linki geçersiz ya da süresi dolmuş. Yöneticinden yeni bir link iste.";

    private final InviteRepository invites;
    private final UserRepository users;
    private final Workspaces workspaces;
    private final InviteProperties properties;
    private final Clock clock;

    InviteService(InviteRepository invites, UserRepository users, Workspaces workspaces, InviteProperties properties,
        Clock clock) {
        this.invites = invites;
        this.users = users;
        this.workspaces = workspaces;
        this.properties = properties;
        this.clock = clock;
    }

    /** Yeni link üretir; aynı kişinin eski, kullanılmamış linkleri geçersiz olur. */
    @Transactional
    public InviteLink issue(AppUser user, UUID companyId) {
        invites.deleteUnusedByUserId(user.getId());
        String token = SecureTokens.generate();
        Instant now = clock.instant();
        Instant expiresAt = now.plus(properties.lifetime());
        invites.save(new Invite(user.getId(), companyId, SecureTokens.hash(token), now, expiresAt));
        return new InviteLink(properties.baseUrl() + "/davet/" + token, expiresAt);
    }

    /**
     * Link açıldığında kişi hâlâ o firmada olmalı: çıkarıldıktan sonra açılan eski link içeri almaz. Kimliğinin tamamı da
     * hâlâ o firmada olmalı (TeamService.issueLoginLink): link üretildikten sonra şifre ya da başka bir firma kazanan
     * hesap linkle devredilmez.
     */
    @Transactional
    public SignIn accept(String token) {
        Instant now = clock.instant();
        Invite invite = invites.findByTokenHash(SecureTokens.hash(token))
            .filter(candidate -> candidate.isUsable(now))
            .orElseThrow(() -> ApiException.badRequest(INVALID_LINK));
        invite.markUsed(now);
        if (workspaces.active(invite.getCompanyId(), invite.getUserId()).isEmpty()) {
            throw ApiException.badRequest(INVALID_LINK);
        }
        AppUser user = users.findById(invite.getUserId())
            .filter(found -> workspaces.isConfinedTo(found, invite.getCompanyId()))
            .orElseThrow(() -> ApiException.badRequest(INVALID_LINK));
        return new SignIn(user, invite.getCompanyId());
    }
}
