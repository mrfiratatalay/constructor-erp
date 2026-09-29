package com.atalay.santiye.platform.dto;

import com.atalay.santiye.onboarding.dto.OnboardingLink;
import java.util.UUID;

/** Açılan firma ve müşteriye gönderilecek kurulum linki (yalnızca bu cevapta görünür). */
public record TenantCreated(UUID companyId, OnboardingLink invite) {
}
