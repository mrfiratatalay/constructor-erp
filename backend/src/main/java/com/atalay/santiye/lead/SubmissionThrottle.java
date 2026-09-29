package com.atalay.santiye.lead;

import com.atalay.santiye.common.error.ApiException;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Component;

/**
 * Herkese açık form için basit sınır: aynı adresten saatte en fazla beş başvuru. Tek sunucu için yeterli; birden
 * çok sunucuda paylaşılan bir sayaca taşınır.
 */
@Component
class SubmissionThrottle {

    private static final int LIMIT = 5;
    private static final Duration WINDOW = Duration.ofHours(1);

    private final Map<String, Deque<Instant>> recent = new ConcurrentHashMap<>();
    private final Clock clock;

    SubmissionThrottle(Clock clock) {
        this.clock = clock;
    }

    void check(String address) {
        Instant now = clock.instant();
        Deque<Instant> times = recent.computeIfAbsent(address, key -> new ArrayDeque<>());
        synchronized (times) {
            while (!times.isEmpty() && times.peekFirst().isBefore(now.minus(WINDOW))) {
                times.pollFirst();
            }
            if (times.size() >= LIMIT) {
                throw ApiException.badRequest("Çok fazla başvuru gönderildi. Biraz sonra tekrar deneyin.");
            }
            times.addLast(now);
        }
    }
}
