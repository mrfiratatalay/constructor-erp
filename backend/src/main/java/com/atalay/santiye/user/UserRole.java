package com.atalay.santiye.user;

/**
 * Herkes her şantiyeyi görür ve yazar; rol, kişinin ayrıca ne yapabildiğini söyler. OWNER: patron, kişileri yönetir,
 * geçmiş yoklamayı düzeltir. SITE_LEAD: şef, her sabah yoklamayı alır, imalatı girer. WORKER: çalışan, firmanın
 * bağlantısıyla gelen herkes; yoklamada sayılır. STOREKEEPER: depo sorumlusu; çalışan gibi yoklamada sayılır,
 * ayrıca şantiyenin imalatını görür (girmez).
 */
public enum UserRole {
    OWNER,
    SITE_LEAD,
    WORKER,
    STOREKEEPER;

    /** Yoklamada sayılır: çalışan ve depo sorumlusu. Patron ve şef yoklamayı alır, kendileri sayılmaz. */
    public boolean isCountedInPuantaj() {
        return this == WORKER || this == STOREKEEPER;
    }
}
