package com.atalay.santiye.common.web;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.method.HandlerTypePredicate;
import org.springframework.web.servlet.config.annotation.PathMatchConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Bizim controller'larımızı /api altında toplar; controller'lar öneki tekrar yazmaz (Madde 3).
 * Paketle sınırlı: springdoc gibi kütüphanelerin kendi controller'ları öneksiz kalır.
 */
@Configuration
public class ApiPrefixConfig implements WebMvcConfigurer {

    public static final String API_PREFIX = "/api";

    @Override
    public void configurePathMatch(PathMatchConfigurer configurer) {
        configurer.addPathPrefix(API_PREFIX, HandlerTypePredicate.forBasePackage("com.atalay.santiye"));
    }
}
