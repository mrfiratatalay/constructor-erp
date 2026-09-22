package com.atalay.santiye.common.time;

import java.time.Clock;
import java.time.ZoneId;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ClockConfig {

    /** Saat enjekte edilir: "bugün" hesapları şantiyenin saat dilimine göre yapılır ve testler sabit saat verebilir. */
    @Bean
    Clock clock(@Value("${app.timezone}") ZoneId zone) {
        return Clock.system(zone);
    }
}
