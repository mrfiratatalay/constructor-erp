package com.atalay.santiye.auth;

import com.atalay.santiye.tenant.Membership;
import com.atalay.santiye.tenant.Workspaces;
import com.atalay.santiye.user.AppUser;
import com.atalay.santiye.user.UserRepository;
import java.time.Clock;
import java.time.Instant;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SessionService {

    private final UserSessionRepository sessions;
    private final UserRepository users;
    private final Workspaces workspaces;
    private final SessionProperties properties;
    private final Clock clock;

    SessionService(UserSessionRepository sessions, UserRepository users, Workspaces workspaces,
        SessionProperties properties, Clock clock) {
        this.sessions = sessions;
        this.users = users;
        this.workspaces = workspaces;
        this.properties = properties;
        this.clock = clock;
    }

    /** Yeni oturum açar; token yalnızca bir kez, çereze yazılmak üzere döner. */
    @Transactional
    public String open(SignIn signIn, String userAgent) {
        String token = SecureTokens.generate();
        UserSession session = new UserSession(signIn.user().getId(), SecureTokens.hash(token), userAgent, clock.instant());
        session.switchTo(signIn.companyId());
        session.extend(clock.instant(), properties.lifetime());
        sessions.save(session);
        return token;
    }

    /**
     * Oturum geçerliyse kişiyi ve çalıştığı firmayı döner. Hiçbir firmada aktif üyeliği kalmayan (ve platform
     * yöneticisi olmayan) kişinin oturumu artık bir şey açmaz: çıkış yapmış sayılır.
     */
    @Transactional
    public Optional<CurrentUser> authenticate(String token) {
        Instant now = clock.instant();
        return sessions.findByTokenHash(SecureTokens.hash(token))
            .filter(session -> !session.isExpired(now))
            .flatMap(session -> {
                session.extend(now, properties.lifetime());
                return users.findById(session.getUserId()).flatMap(user -> principalOf(session, user));
            });
    }

    /** Kişinin üyesi olduğu başka bir firmaya geçer; üye olmadığı firmaya geçemez. */
    @Transactional
    public boolean switchWorkspace(String token, UUID userId, UUID companyId) {
        if (workspaces.active(companyId, userId).isEmpty()) {
            return false;
        }
        sessions.findByTokenHash(SecureTokens.hash(token))
            .filter(session -> session.getUserId().equals(userId))
            .ifPresent(session -> session.switchTo(companyId));
        return true;
    }

    @Transactional
    public void close(String token) {
        sessions.deleteByTokenHash(SecureTokens.hash(token));
    }

    /** Firmadan çıkarılan kişinin o firmadaki oturumları anında kapanır. */
    @Transactional
    public void closeAllIn(UUID userId, UUID companyId) {
        sessions.deleteAllInCompany(userId, companyId);
    }

    private Optional<CurrentUser> principalOf(UserSession session, AppUser user) {
        Optional<Membership> workspace = workspaces.resolve(user.getId(), session.getCompanyId());
        if (workspace.isEmpty() && !user.isPlatformAdmin()) {
            return Optional.empty();
        }
        UUID companyId = workspace.map(Membership::getCompanyId).orElse(null);
        if (!Objects.equals(companyId, session.getCompanyId())) {
            session.switchTo(companyId);
        }
        return Optional.of(new CurrentUser(user.getId(), companyId, workspace.map(Membership::getRole).orElse(null),
            user.getFullName(), user.isPlatformAdmin()));
    }
}
