package com.atalay.santiye.auth;

import com.atalay.santiye.user.UserRole;
import java.util.UUID;

/**
 * Oturumu açık kullanıcı ve çalıştığı firma. Controller'lara @AuthenticationPrincipal ile gelir. companyId ve role
 * oturumdan, sunucu tarafında ve üyelik doğrulanarak çözülür; istemcinin gönderdiği hiçbir firma kimliğine dayanmaz.
 * Firmada üyeliği olmayan platform yöneticisinde ikisi de boştur; firma uçları ona zaten kapalıdır (SecurityConfig).
 */
public record CurrentUser(UUID userId, UUID companyId, UserRole role, String fullName, boolean platformAdmin) {

    public boolean hasWorkspace() {
        return companyId != null;
    }

    public boolean isOwner() {
        return role == UserRole.OWNER;
    }
}
