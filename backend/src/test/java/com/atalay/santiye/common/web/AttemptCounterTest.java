package com.atalay.santiye.common.web;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import org.junit.jupiter.api.Test;

class AttemptCounterTest {

    private static final Duration WINDOW = Duration.ofMinutes(15);

    /** Testin ilerletebildiği saat: pencerenin dolmasını beklemeden denemek için. */
    private static final class MovingClock extends Clock {

        private Instant now = Instant.parse("2026-10-01T09:00:00Z");

        void advance(Duration duration) {
            now = now.plus(duration);
        }

        @Override
        public Instant instant() {
            return now;
        }

        @Override
        public ZoneId getZone() {
            return ZoneOffset.UTC;
        }

        @Override
        public Clock withZone(ZoneId zone) {
            return this;
        }
    }

    private final MovingClock clock = new MovingClock();
    private final AttemptCounter counter = new AttemptCounter(3, WINDOW, clock);

    @Test
    void aKeyIsStoppedOnceItUsesUpItsAttempts() {
        counter.record("1.2.3.4");
        counter.record("1.2.3.4");
        assertThat(counter.isExhausted("1.2.3.4")).isFalse();

        counter.record("1.2.3.4");

        assertThat(counter.isExhausted("1.2.3.4")).isTrue();
        assertThat(counter.isExhausted("5.6.7.8")).isFalse();
    }

    @Test
    void theWindowEndsAndCountingStartsOver() {
        counter.record("a");
        counter.record("a");
        counter.record("a");

        clock.advance(WINDOW);

        assertThat(counter.isExhausted("a")).isFalse();
        counter.record("a");
        assertThat(counter.isExhausted("a")).isFalse();
    }

    @Test
    void clearingForgetsTheAttempts() {
        counter.record("a");
        counter.record("a");
        counter.record("a");

        counter.clear("a");

        assertThat(counter.isExhausted("a")).isFalse();
    }
}
