package com.atalay.santiye.auth.dto;

import com.atalay.santiye.user.UserRole;
import jakarta.annotation.Nullable;
import java.util.UUID;

/** Kişinin üye olduğu bir firma: firma değiştiricide görünür. */
public record WorkspaceOptionView(UUID companyId, String name, @Nullable String logoUrl, UserRole role) {
}
