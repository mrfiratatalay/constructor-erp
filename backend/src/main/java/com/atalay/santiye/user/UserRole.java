package com.atalay.santiye.user;

/**
 * Kişinin firmadaki rolü (üyeliğin rolü). Herkes her şantiyeyi görür ve yazar; rol, kişinin ayrıca ne yapabildiğini
 * söyler. OWNER: patron, kişileri yönetir, geçmiş yoklamayı düzeltir. SITE_LEAD: şef, her sabah yoklamayı alır.
 * WAREHOUSE: depo sorumlusu, malzemeyi ve stoğu yönetir. WORKER: çalışan, firmanın bağlantısıyla gelen herkes;
 * yoklamada sayılır. Rolün açtığı işler tek yerde: {@link com.atalay.santiye.auth.Permission}. Platformu yöneten
 * ekibin rolü ayrıdır: {@link PlatformRole}.
 */
public enum UserRole {
    OWNER,
    SITE_LEAD,
    WAREHOUSE,
    WORKER
}
