package com.atalay.santiye.tenant;

import javax.sql.DataSource;
import org.springframework.beans.factory.config.BeanPostProcessor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/** Spring Boot'un kurduğu bağlantı havuzunu firma bağlamını taşıyan sarmalayıcıyla değiştirir (JPA, JDBC, Flyway). */
@Configuration(proxyBeanMethods = false)
class TenantDataSourceConfig {

    @Bean
    static BeanPostProcessor tenantScopedDataSource() {
        return new BeanPostProcessor() {
            @Override
            public Object postProcessAfterInitialization(Object bean, String beanName) {
                if (bean instanceof DataSource dataSource && !(bean instanceof TenantScopedDataSource)) {
                    return new TenantScopedDataSource(dataSource);
                }
                return bean;
            }
        };
    }
}
