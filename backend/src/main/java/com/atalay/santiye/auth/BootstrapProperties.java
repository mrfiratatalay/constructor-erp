package com.atalay.santiye.auth;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.util.StringUtils;

@ConfigurationProperties("app.bootstrap")
public record BootstrapProperties(String companyName, String ownerName, String ownerEmail, String ownerPassword) {

    boolean isComplete() {
        return StringUtils.hasText(companyName) && StringUtils.hasText(ownerName)
            && StringUtils.hasText(ownerEmail) && StringUtils.hasText(ownerPassword);
    }
}
