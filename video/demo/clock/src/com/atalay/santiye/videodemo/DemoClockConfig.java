package com.atalay.santiye.videodemo;

import java.time.Clock;
import java.time.Duration;
import java.time.ZoneId;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

/**
 * Yalnızca reklam çekimi: ürünün saatini sabit bir farkla kaydırır. Ürün koduna girmez; çekim betiği bu sınıfı
 * ayrı bir jar olarak yükler (PropertiesLauncher, loader.path). Fark saniye cinsindendir ve tarayıcıya da aynısı
 * verilir: sunucu ile ekran aynı "bugün"ü görür.
 */
@Configuration
class DemoClockConfig {

    @Bean
    @Primary
    Clock demoClock(@Value("${app.timezone}") ZoneId zone, @Value("${demo.offset-seconds}") long offsetSeconds) {
        return Clock.offset(Clock.system(zone), Duration.ofSeconds(offsetSeconds));
    }
}
