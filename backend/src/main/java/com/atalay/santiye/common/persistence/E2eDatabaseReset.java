package com.atalay.santiye.common.persistence;

import org.springframework.boot.flyway.autoconfigure.FlywayMigrationStrategy;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

/**
 * Yalnızca uçtan uca test profilinde: backend her açıldığında test veritabanı sıfırdan kurulur.
 * Temizleme (clean) başka hiçbir profilde çalışmaz; application-e2e.yml ayrı bir veritabanını gösterir.
 */
@Configuration
@Profile("e2e")
class E2eDatabaseReset {

    @Bean
    FlywayMigrationStrategy cleanThenMigrate() {
        return flyway -> {
            flyway.clean();
            flyway.migrate();
        };
    }
}
