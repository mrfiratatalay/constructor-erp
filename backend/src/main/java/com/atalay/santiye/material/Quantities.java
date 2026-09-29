package com.atalay.santiye.material;

import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;
import java.util.Locale;

/** Miktarın Türkçe yazımı: binlik nokta, ondalık virgül, gereksiz sıfır yok ("1.850", "2,4"). */
final class Quantities {

    private static final Locale TURKISH = Locale.of("tr", "TR");

    private Quantities() {
    }

    static String format(BigDecimal quantity) {
        return new DecimalFormat("#,##0.###", DecimalFormatSymbols.getInstance(TURKISH)).format(quantity);
    }

    static String withUnit(BigDecimal quantity, String unit) {
        return format(quantity) + " " + unit;
    }

    static String number(long number) {
        return "MH-%06d".formatted(number);
    }
}
