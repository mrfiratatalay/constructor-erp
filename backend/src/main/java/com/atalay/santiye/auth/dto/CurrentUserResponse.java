package com.atalay.santiye.auth.dto;

import com.atalay.santiye.auth.Permission;
import com.atalay.santiye.user.UserRole;
import java.util.List;
import java.util.UUID;

/** permissions: rolün açtığı işler; arayüz düğmeleri rol adına göre değil bunlara göre gösterir. */
public record CurrentUserResponse(UUID id, String fullName, UserRole role, String companyName,
    List<Permission> permissions) {
}
