package com.atalay.santiye.lead;

import com.atalay.santiye.common.error.ApiException;
import com.atalay.santiye.common.web.AttemptCounter;
import java.time.Clock;
import java.time.Duration;
import org.springframework.stereotype.Component;

/**
 * Herkese açık form için basit sınır: aynı adresten saatte en fazla beş başvuru. Sayaç bellekte sınırlıdır
 * (AttemptCounter): adres değiştirerek form dolduran biri sunucunun belleğini büyütemez.
 */
@Component
class SubmissionThrottle {

    private static final int LIMIT = 5;
    private static final Duration WINDOW = Duration.ofHours(1);

    private final AttemptCounter submissions;

    SubmissionThrottle(Clock clock) {
        this.submissions = new AttemptCounter(LIMIT, WINDOW, clock);
    }

    void check(String address) {
        if (submissions.isExhausted(address)) {
            throw ApiException.tooManyRequests("Çok fazla başvuru gönderildi. Biraz sonra tekrar deneyin.");
        }
        submissions.record(address);
    }
}
