package com.atalay.santiye.platform.dto;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateTenantRequest(
    @NotBlank @Size(max = 120) String name,
    @Nullable @Size(max = 20) String phone,
    @Nullable @Size(max = 254) String email,
    @Nullable @Size(max = 60) String city) {
}
