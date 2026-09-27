package com.atalay.santiye.user;

/**
 * Herkes her şantiyeyi görür ve yazar; rol, kişinin ayrıca ne yapabildiğini söyler. OWNER: patron, kişileri yönetir,
 * geçmiş yoklamayı düzeltir. SITE_LEAD: şef, her sabah yoklamayı alır. WORKER: çalışan, firmanın bağlantısıyla gelen
 * herkes; yoklamada sayılır.
 */
public enum UserRole {
    OWNER,
    SITE_LEAD,
    WORKER
}
