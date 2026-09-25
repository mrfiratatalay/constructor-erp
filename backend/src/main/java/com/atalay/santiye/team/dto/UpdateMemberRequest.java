package com.atalay.santiye.team.dto;

import com.atalay.santiye.user.UserRole;
import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * Kişiyi düzeltmek (ad, numara), patron yapmak ya da firmadan çıkarmak (active=false). Şantiye listesi yoktur:
 * herkes her şantiyededir.
 */
public record UpdateMemberRequest(
    @NotBlank @Size(max = 120) String fullName,
    @Nullable @Size(max = 20) String phone,
    @NotNull UserRole role,
    @NotNull Boolean active) {
}
