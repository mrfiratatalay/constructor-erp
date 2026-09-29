package com.atalay.santiye.onboarding;

/** Kaydedilen durum; süresi dolmak kaydedilmez, expiresAt'ten hesaplanır (arayüzde EXPIRED). */
public enum OnboardingInviteStatus {
    PENDING,
    USED,
    REVOKED
}
