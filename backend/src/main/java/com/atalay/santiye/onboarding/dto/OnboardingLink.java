package com.atalay.santiye.onboarding.dto;

import java.time.Instant;
import java.util.UUID;

/** Yeni üretilen kurulum linki; yalnızca bu cevapta görünür, veritabanında açık hâli yoktur. */
public record OnboardingLink(UUID inviteId, String url, Instant expiresAt) {
}
