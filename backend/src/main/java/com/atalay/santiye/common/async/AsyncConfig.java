package com.atalay.santiye.common.async;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * @Async: bildirim gibi kullanıcının beklememesi gereken işler arka planda (sanal thread'lerle) çalışır.
 * @Scheduled: günlük hatırlatmalar.
 */
@Configuration
@EnableAsync
@EnableScheduling
class AsyncConfig {
}
