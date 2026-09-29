package com.atalay.santiye.tenant;

import java.util.List;

/**
 * Hangi adresler firmanın çalışma alanıdır? /api altında bunların dışındaki her şey: oturum, platform yönetimi,
 * tanıtım sitesi, kurulum sihirbazı ve katılma bağlantısı firma bağlamı dışında çalışır. Yeni modül /api altına
 * eklendiğinde firma kuralı (yetki, abonelik, RLS) kendiliğinden gelir.
 */
public final class WorkspacePaths {

    public static final List<String> OUTSIDE = List.of(
        "/api/auth/", "/api/platform/", "/api/public/", "/api/setup/", "/api/join/");

    private WorkspacePaths() {
    }

    public static boolean isWorkspace(String path) {
        return path.startsWith("/api/") && OUTSIDE.stream().noneMatch(path::startsWith);
    }
}
