package com.atalay.santiye.billing;

/**
 * Planla açılıp kapanan modüllerin anahtarları (features tablosu). Yeni modül: buraya anahtar, features tablosuna
 * satır, uygun planlara plan_features satırı, controller'a @RequiresFeature (MIMARI-SAAS.md Bölüm 6).
 */
public final class Features {

    public static final String TASKS = "tasks";
    public static final String ATTENDANCE = "attendance";
    public static final String MATERIALS = "materials";
    public static final String PRODUCTION = "production";

    private Features() {
    }
}
