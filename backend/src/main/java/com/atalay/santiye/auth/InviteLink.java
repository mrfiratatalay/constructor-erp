package com.atalay.santiye.auth;

import java.time.Instant;

/** Patronun WhatsApp'tan göndereceği tek kullanımlık giriş linki. */
public record InviteLink(String url, Instant expiresAt) {
}
