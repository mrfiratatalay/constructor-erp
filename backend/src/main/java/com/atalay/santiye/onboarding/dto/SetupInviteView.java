package com.atalay.santiye.onboarding.dto;

import jakarta.annotation.Nullable;
import java.time.LocalDate;
import java.util.List;

/** Kurulum sihirbazının açılışı: platformun önceden girdiği firma bilgileri ve satın alınan paket. */
public record SetupInviteView(String companyName, @Nullable String phone, @Nullable String email,
    @Nullable String city, @Nullable String logoUrl, @Nullable String planName, @Nullable LocalDate endsOn,
    List<String> features) {
}
