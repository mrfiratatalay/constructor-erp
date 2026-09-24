package com.atalay.santiye.team.dto;

import com.atalay.santiye.user.UserRole;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;
import java.util.UUID;

/** Telefon zorunludur: giriş linki WhatsApp'ta doğrudan o kişinin sohbetine gider. */
public record CreateMemberRequest(
    @NotBlank @Size(max = 120) String fullName,
    @NotBlank @Size(max = 20) String phone,
    @NotNull UserRole role,
    @NotNull List<UUID> siteIds) {
}
