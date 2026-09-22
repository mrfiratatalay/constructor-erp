package com.atalay.santiye.auth;

import java.time.Duration;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties("app.session")
public record SessionProperties(Duration lifetime, boolean secureCookie) {
}
