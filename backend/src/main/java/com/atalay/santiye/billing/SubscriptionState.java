package com.atalay.santiye.billing;

/**
 * Bugünün gözüyle abonelik: ACTIVE (bugünü kapsıyor), SCHEDULED (ileride başlayacak), EXPIRED (bitti), SUSPENDED
 * (askıda), CANCELLED (iptal). Yalnızca ACTIVE çalışma alanını açar.
 */
public enum SubscriptionState {
    ACTIVE,
    SCHEDULED,
    EXPIRED,
    SUSPENDED,
    CANCELLED
}
