package com.atalay.santiye.join.dto;

import java.time.Instant;

/** Patronun WhatsApp'tan göndereceği şantiye davet bağlantısı. */
public record SiteInviteLink(String url, Instant expiresAt) {
}
