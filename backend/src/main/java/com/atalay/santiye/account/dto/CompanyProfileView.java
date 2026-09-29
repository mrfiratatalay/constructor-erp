package com.atalay.santiye.account.dto;

import jakarta.annotation.Nullable;
import java.util.UUID;

/** Firmanın kendi gördüğü kimliği: çalışma alanının markası buradan gelir. */
public record CompanyProfileView(UUID id, String name, String slug, @Nullable String phone, @Nullable String email,
    @Nullable String city, @Nullable String logoUrl) {
}
