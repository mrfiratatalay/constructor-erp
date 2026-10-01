package com.atalay.santiye.common.web;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;

/**
 * Vekil kapısı yalnızca sır verildiğinde kurulur (app.proxy.secret, ortamdan PROXY_SECRET). Her şeyden önce çalışır:
 * güvenlik zinciri ve deneme sınırları kişinin gerçek adresini görür, doğrudan gelen istek hiçbir işe ulaşmaz.
 */
@Configuration(proxyBeanMethods = false)
class ProxyGateConfig {

    @Bean
    FilterRegistrationBean<ProxyGate> proxyGate(@Value("${app.proxy.secret:}") String secret) {
        FilterRegistrationBean<ProxyGate> registration = new FilterRegistrationBean<>(new ProxyGate(secret));
        registration.setEnabled(!secret.isBlank());
        registration.setOrder(Ordered.HIGHEST_PRECEDENCE);
        return registration;
    }
}
