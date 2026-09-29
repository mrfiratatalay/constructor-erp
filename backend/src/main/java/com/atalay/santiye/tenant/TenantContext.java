package com.atalay.santiye.tenant;

import java.util.Optional;
import java.util.UUID;

/**
 * İsteğin hangi firma adına çalıştığı. Yalnızca sunucu yazar (TenantContextFilter, oturumdan); veritabanı bağlantısı
 * bu değeri RLS'e taşır (TenantScopedDataSource). İstek bitince silinir; arka plan işleri boş bağlamla başlar.
 */
public final class TenantContext {

    private static final ThreadLocal<UUID> CURRENT = new ThreadLocal<>();

    private TenantContext() {
    }

    public static Optional<UUID> current() {
        return Optional.ofNullable(CURRENT.get());
    }

    static void set(UUID companyId) {
        CURRENT.set(companyId);
    }

    static void clear() {
        CURRENT.remove();
    }
}
