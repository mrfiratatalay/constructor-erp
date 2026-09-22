package com.atalay.santiye.site.dto;

import com.atalay.santiye.site.SiteStatus;
import jakarta.annotation.Nullable;
import java.util.List;
import java.util.UUID;

public record SiteView(UUID id, String name, @Nullable String address, SiteStatus status, List<SiteLead> leads) {
}
