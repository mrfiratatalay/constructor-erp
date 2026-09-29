package com.atalay.santiye.company;

/**
 * Firmanın (tenant) yaşam döngüsü. Silme yoktur: askıya alınan firma veri kaybetmeden geri açılır, arşivlenen firma
 * listelerden düşer ama verisi durur. Kalıcı silme normal bir işlem değildir (MIMARI-SAAS.md Karar 8).
 */
public enum CompanyStatus {
    ACTIVE,
    SUSPENDED,
    ARCHIVED
}
