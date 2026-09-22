package com.atalay.santiye.auth;

import com.atalay.santiye.common.error.ApiException;
import com.atalay.santiye.user.AppUser;
import com.atalay.santiye.user.UserRepository;
import java.time.Clock;
import java.time.Instant;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class InviteService {

    private static final String INVALID_LINK =
        "Bu giriş linki geçersiz ya da süresi dolmuş. Yöneticinden yeni bir link iste.";

    private final InviteRepository invites;
    private final UserRepository users;
    private final InviteProperties properties;
    private final Clock clock;

    InviteService(InviteRepository invites, UserRepository users, InviteProperties properties, Clock clock) {
        this.invites = invites;
        this.users = users;
        this.properties = properties;
        this.clock = clock;
    }

    /** Yeni link üretir; aynı kişinin eski, kullanılmamış linkleri geçersiz olur. */
    @Transactional
    public InviteLink issue(AppUser user) {
        invites.deleteUnusedByUserId(user.getId());
        String token = SecureTokens.generate();
        Instant now = clock.instant();
        Instant expiresAt = now.plus(properties.lifetime());
        invites.save(new Invite(user.getId(), SecureTokens.hash(token), now, expiresAt));
        return new InviteLink(properties.baseUrl() + "/davet/" + token, expiresAt);
    }

    @Transactional
    public AppUser accept(String token) {
        Instant now = clock.instant();
        Invite invite = invites.findByTokenHash(SecureTokens.hash(token))
            .filter(candidate -> candidate.isUsable(now))
            .orElseThrow(() -> ApiException.badRequest(INVALID_LINK));
        invite.markUsed(now);
        return users.findById(invite.getUserId())
            .filter(AppUser::isActive)
            .orElseThrow(() -> ApiException.badRequest(INVALID_LINK));
    }
}
