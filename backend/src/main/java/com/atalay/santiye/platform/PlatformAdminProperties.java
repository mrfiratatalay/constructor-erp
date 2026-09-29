package com.atalay.santiye.platform;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.util.StringUtils;

/** Constructor ERP ekibinin ilk süper yöneticisi; şifre ortam değişkeninden gelir, koda girmez (Madde 5). */
@ConfigurationProperties("app.platform")
public record PlatformAdminProperties(String adminName, String adminEmail, String adminPassword) {

    boolean isComplete() {
        return StringUtils.hasText(adminName) && StringUtils.hasText(adminEmail) && StringUtils.hasText(adminPassword);
    }
}
