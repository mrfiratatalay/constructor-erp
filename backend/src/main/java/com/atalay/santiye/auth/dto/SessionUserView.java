package com.atalay.santiye.auth.dto;

import jakarta.annotation.Nullable;
import java.util.UUID;

public record SessionUserView(UUID id, String fullName, @Nullable String email, boolean platformAdmin) {
}
