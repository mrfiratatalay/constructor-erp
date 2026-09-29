package com.atalay.santiye.user;

/**
 * Constructor ERP'yi işleten ekibin rolü; firmadaki rollerden (UserRole) ayrıdır. Süper yönetici firmaları, abonelikleri
 * ve ödemeleri yönetir; bir firmanın patronu değildir ve firmanın iş verisine platform uçlarından dokunmaz.
 */
public enum PlatformRole {
    SUPER_ADMIN
}
