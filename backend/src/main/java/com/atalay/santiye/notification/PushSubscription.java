package com.atalay.santiye.notification;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "push_subscriptions")
class PushSubscription {

    @Id
    private UUID id;
    private UUID userId;
    private String endpoint;
    private Instant createdAt;

    protected PushSubscription() {
    }

    PushSubscription(UUID userId, String endpoint, Instant createdAt) {
        this.id = UUID.randomUUID();
        this.userId = userId;
        this.endpoint = endpoint;
        this.createdAt = createdAt;
    }

    /** Aynı cihaz başka biriyle giriş yaparsa bildirimler artık yeni kişiye gider. */
    void assignTo(UUID newUserId) {
        this.userId = newUserId;
    }

    String endpoint() {
        return endpoint;
    }
}
