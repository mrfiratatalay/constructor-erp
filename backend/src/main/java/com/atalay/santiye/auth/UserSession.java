package com.atalay.santiye.auth;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Duration;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "user_sessions")
class UserSession {

    /** Her istekte veritabanına yazmamak için süre en fazla bu aralıkla uzatılır. */
    private static final Duration EXTEND_INTERVAL = Duration.ofHours(1);
    private static final int USER_AGENT_LIMIT = 300;

    @Id
    private UUID id;
    private UUID userId;
    private String tokenHash;
    private Instant createdAt;
    private Instant lastSeenAt;
    private Instant expiresAt;
    private String userAgent;

    protected UserSession() {
    }

    UserSession(UUID userId, String tokenHash, String userAgent, Instant now) {
        this.id = UUID.randomUUID();
        this.userId = userId;
        this.tokenHash = tokenHash;
        this.userAgent = userAgent == null ? null : userAgent.substring(0, Math.min(userAgent.length(), USER_AGENT_LIMIT));
        this.createdAt = now;
        this.lastSeenAt = now;
    }

    boolean isExpired(Instant now) {
        return !now.isBefore(expiresAt);
    }

    /** Kayan süre: telefonu her gün kullanan formen hiç çıkış yapmak zorunda kalmaz. */
    void extend(Instant now, Duration lifetime) {
        boolean firstTime = expiresAt == null;
        if (!firstTime && Duration.between(lastSeenAt, now).compareTo(EXTEND_INTERVAL) < 0) {
            return;
        }
        lastSeenAt = now;
        expiresAt = now.plus(lifetime);
    }

    UUID getUserId() {
        return userId;
    }
}
