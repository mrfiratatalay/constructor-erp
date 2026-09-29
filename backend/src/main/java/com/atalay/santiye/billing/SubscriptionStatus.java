package com.atalay.santiye.billing;

/** Kaydedilen durum. Süresi dolmak kaydedilmez, bitiş tarihinden hesaplanır (bkz. SubscriptionState). */
public enum SubscriptionStatus {
    ACTIVE,
    SUSPENDED,
    CANCELLED
}
