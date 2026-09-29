package com.atalay.santiye.auth;

import com.atalay.santiye.user.UserRole;
import java.util.EnumSet;
import java.util.List;
import java.util.Set;

/**
 * Rolün açtığı işler, tek yerde. Arayüz düğmeleri rol adına göre değil bu anahtarlara göre gösterir; uçlar da
 * aynı anahtarla korunur (@PreAuthorize("hasAuthority('VIEW_MATERIALS')")). Rol matrisi değişince yalnızca burası
 * değişir.
 */
public enum Permission {
    VIEW_MATERIALS,
    CREATE_MATERIAL_MOVEMENT,
    UPDATE_MATERIAL_MOVEMENT,
    CANCEL_MATERIAL_MOVEMENT,
    MANAGE_MATERIAL_CATALOG,
    EXPORT_MATERIALS;

    /**
     * Şef sevkiyatı görür, kendi şantiyesinden çıkarır ve döküm alır. Malzeme kartını da açabilir: sevkiyat
     * girebilen biri listede olmayan malzemede tıkanmamalı, yoksa kayıt hiç girilmez. İptal depo ve patronundur.
     */
    private static final Set<Permission> SITE_LEAD = EnumSet.of(VIEW_MATERIALS, CREATE_MATERIAL_MOVEMENT,
        MANAGE_MATERIAL_CATALOG, EXPORT_MATERIALS);

    public static List<Permission> grantedTo(UserRole role) {
        Set<Permission> granted = switch (role) {
            case OWNER, WAREHOUSE -> EnumSet.allOf(Permission.class);
            case SITE_LEAD -> SITE_LEAD;
            case WORKER -> EnumSet.noneOf(Permission.class);
        };
        return List.copyOf(granted);
    }
}
