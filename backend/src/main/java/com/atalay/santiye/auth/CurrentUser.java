package com.atalay.santiye.auth;

import com.atalay.santiye.user.AppUser;
import com.atalay.santiye.user.UserRole;
import java.util.UUID;

/** Oturumu açık kullanıcı. Controller'lara @AuthenticationPrincipal ile gelir. */
public record CurrentUser(UUID userId, UUID companyId, UserRole role, String fullName) {

    static CurrentUser of(AppUser user) {
        return new CurrentUser(user.getId(), user.getCompanyId(), user.getRole(), user.getFullName());
    }

    public boolean isOwner() {
        return role == UserRole.OWNER;
    }
}
