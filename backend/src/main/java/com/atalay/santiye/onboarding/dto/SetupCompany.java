package com.atalay.santiye.onboarding.dto;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SetupCompany(
    @NotBlank @Size(max = 120) String name,
    @Nullable @Size(max = 20) String phone,
    @Nullable @Email @Size(max = 254) String email,
    @Nullable @Size(max = 60) String city) {
}
