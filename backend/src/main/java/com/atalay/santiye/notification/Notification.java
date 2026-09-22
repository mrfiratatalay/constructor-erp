package com.atalay.santiye.notification;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "notifications")
class Notification {

    @Id
    private UUID id;
    private UUID userId;
    private String title;
    private String body;
    private String url;
    private Instant createdAt;

    protected Notification() {
    }

    Notification(UUID userId, NotificationContent content, Instant createdAt) {
        this.id = UUID.randomUUID();
        this.userId = userId;
        this.title = content.title();
        this.body = content.body();
        this.url = content.url();
        this.createdAt = createdAt;
    }

    UUID getId() {
        return id;
    }

    String getTitle() {
        return title;
    }

    String getBody() {
        return body;
    }

    String getUrl() {
        return url;
    }

    Instant getCreatedAt() {
        return createdAt;
    }
}
