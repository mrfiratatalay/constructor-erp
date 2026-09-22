package com.atalay.santiye.notification;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties("app.push")
public record PushProperties(String subject) {
}
