package com.atalay.santiye.site.dto;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateSiteRequest(@NotBlank @Size(max = 120) String name, @Nullable @Size(max = 300) String address) {
}
