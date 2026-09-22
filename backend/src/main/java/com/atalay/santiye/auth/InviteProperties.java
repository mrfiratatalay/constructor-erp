package com.atalay.santiye.auth;

import java.time.Duration;
import org.springframework.boot.context.properties.ConfigurationProperties;

/** baseUrl: davet linkinin açacağı uygulama adresi (frontend). */
@ConfigurationProperties("app.invite")
public record InviteProperties(Duration lifetime, String baseUrl) {
}
