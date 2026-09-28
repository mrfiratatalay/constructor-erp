package com.atalay.santiye.production;

import java.math.BigDecimal;
import java.math.RoundingMode;

/** Bir imalatın sayıları: toplam ve gerçekleşen. Kalan ve yüzde bunlardan hesaplanır, saklanmaz. */
record ProductionFigures(BigDecimal total, BigDecimal done) {

    private static final BigDecimal HUNDRED = BigDecimal.valueOf(100);

    /** Toplamı aşan girişte (şef uyarıyı onayladıysa) kalan sıfırdır, eksi olmaz. */
    BigDecimal remaining() {
        return total.subtract(done).max(BigDecimal.ZERO);
    }

    /** Tek ondalık: %48,8. Toplamı aşan girişte %100'ü geçebilir; çubuk ekranda %100'de durur. */
    double percent() {
        return done.multiply(HUNDRED).divide(total, 1, RoundingMode.HALF_UP).doubleValue();
    }

    boolean isComplete() {
        return done.compareTo(total) >= 0;
    }
}
