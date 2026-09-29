package com.atalay.santiye.onboarding;

import java.time.Duration;
import org.springframework.boot.context.properties.ConfigurationProperties;

/** Kurulum linkinin geçerlilik süresi; link firmanın telefonuna/e-postasına elle gönderilir. */
@ConfigurationProperties("app.onboarding")
public record OnboardingProperties(Duration lifetime) {
}
