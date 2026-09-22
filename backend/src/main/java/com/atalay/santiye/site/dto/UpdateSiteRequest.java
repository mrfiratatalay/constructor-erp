package com.atalay.santiye.site.dto;

import com.atalay.santiye.site.SiteStatus;
import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UpdateSiteRequest(
    @NotBlank @Size(max = 120) String name,
    @Nullable @Size(max = 300) String address,
    @NotNull SiteStatus status) {
}
