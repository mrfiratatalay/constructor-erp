package com.atalay.santiye.site.dto;

import jakarta.annotation.Nullable;
import java.util.UUID;

/** phone: patronun sorun görünce tek dokunuşla araması için; ekip formunda girilmediyse boş. */
public record SiteLead(UUID id, String fullName, @Nullable String phone) {
}
