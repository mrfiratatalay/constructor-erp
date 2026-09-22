package com.atalay.santiye.auth;

import com.atalay.santiye.user.AppUser;
import com.atalay.santiye.user.UserRepository;
import java.time.Clock;
import java.time.Instant;
import java.util.Collection;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SessionService {

    private final UserSessionRepository sessions;
    private final UserRepository users;
    private final SessionProperties properties;
    private final Clock clock;

    SessionService(UserSessionRepository sessions, UserRepository users, SessionProperties properties, Clock clock) {
        this.sessions = sessions;
        this.users = users;
        this.properties = properties;
        this.clock = clock;
    }

    /** Yeni oturum açar; token yalnızca bir kez, çereze yazılmak üzere döner. */
    @Transactional
    public String open(AppUser user, String userAgent) {
        String token = SecureTokens.generate();
        UserSession session = new UserSession(user.getId(), SecureTokens.hash(token), userAgent, clock.instant());
        session.extend(clock.instant(), properties.lifetime());
        sessions.save(session);
        return token;
    }

    @Transactional
    public Optional<CurrentUser> authenticate(String token) {
        Instant now = clock.instant();
        return sessions.findByTokenHash(SecureTokens.hash(token))
            .filter(session -> !session.isExpired(now))
            .flatMap(session -> {
                session.extend(now, properties.lifetime());
                return users.findById(session.getUserId());
            })
            .filter(AppUser::isActive)
            .map(CurrentUser::of);
    }

    @Transactional
    public void close(String token) {
        sessions.deleteByTokenHash(SecureTokens.hash(token));
    }

    /** Pasif yapılan kullanıcının tüm cihazlardaki oturumları anında kapanır. */
    @Transactional
    public void closeAll(UUID userId) {
        sessions.deleteAllByUserId(userId);
    }

    @Transactional(readOnly = true)
    public Map<UUID, Instant> lastSeen(Collection<UUID> userIds) {
        return sessions.findLastSeen(userIds).stream()
            .collect(Collectors.toMap(LastSeen::userId, LastSeen::lastSeenAt));
    }
}
