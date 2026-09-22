package com.atalay.santiye.notification.dto;

import java.time.Instant;
import java.util.UUID;

public record NotificationView(UUID id, String title, String body, String url, Instant createdAt) {
}
