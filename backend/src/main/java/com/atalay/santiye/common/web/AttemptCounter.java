package com.atalay.santiye.common.web;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Bir anahtarın (istemci adresi, e-posta…) belli bir süredeki deneme sayısı: kaba kuvvete ve sele karşı sınır.
 * Anahtar başına tek sayaç tutulur; pencere ilk denemeyle başlar, süresi dolunca yenisi açılır. Bellek sınırlıdır:
 * anahtar sayısı tavana dayanınca süresi dolanlar atılır, böylece sayısız adres üreten biri sunucunun belleğini
 * dolduramaz. Tek sunucu içindir; birden çok sunucuya geçilince paylaşılan bir sayaca taşınır.
 */
public final class AttemptCounter {

    private static final Logger log = LoggerFactory.getLogger(AttemptCounter.class);
    private static final int MAX_KEYS = 100_000;

    private record Window(Instant startedAt, int attempts) {
    }

    private final Map<String, Window> windows = new ConcurrentHashMap<>();
    private final int limit;
    private final Duration period;
    private final Clock clock;

    public AttemptCounter(int limit, Duration period, Clock clock) {
        this.limit = limit;
        this.period = period;
        this.clock = clock;
    }

    /** Anahtar bu pencerede hakkını doldurdu mu. */
    public boolean isExhausted(String key) {
        Window window = windows.get(key);
        return window != null && !expired(window, clock.instant()) && window.attempts() >= limit;
    }

    public void record(String key) {
        Instant now = clock.instant();
        windows.compute(key, (ignored, window) -> window == null || expired(window, now)
            ? new Window(now, 1) : new Window(window.startedAt(), window.attempts() + 1));
        if (windows.size() > MAX_KEYS) {
            prune(now);
        }
    }

    public void clear(String key) {
        windows.remove(key);
    }

    /** Önce süresi dolanlar atılır; yine de tavandaysa (yoğun saldırı) sayaçlar sıfırlanır, bellek korunur. */
    private void prune(Instant now) {
        windows.values().removeIf(window -> expired(window, now));
        if (windows.size() > MAX_KEYS) {
            log.warn("Deneme sayacı {} anahtarı aştı; sayaçlar sıfırlandı.", MAX_KEYS);
            windows.clear();
        }
    }

    private boolean expired(Window window, Instant now) {
        return !now.isBefore(window.startedAt().plus(period));
    }
}
