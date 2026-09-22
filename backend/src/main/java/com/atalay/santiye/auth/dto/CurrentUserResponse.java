package com.atalay.santiye.auth.dto;

import com.atalay.santiye.user.UserRole;
import java.util.UUID;

public record CurrentUserResponse(UUID id, String fullName, UserRole role, String companyName) {
}
