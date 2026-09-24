package com.atalay.santiye.team.dto;

import com.atalay.santiye.user.UserRole;
import jakarta.annotation.Nullable;
import java.util.UUID;

/** Düzenlenen kişinin son hâli. Kimsenin durumu ("son görülme") tutulmaz, yazılmaz. */
public record MemberView(UUID id, String fullName, @Nullable String phone, UserRole role, boolean active) {
}
