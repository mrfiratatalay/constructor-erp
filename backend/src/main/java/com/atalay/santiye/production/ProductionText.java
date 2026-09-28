package com.atalay.santiye.production;

import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;
import java.util.Locale;

/** İmalatın yazıları: sayılar Türkçe yazılır (3,5 · 12.000 · %48,8), boş bırakılan alan saklanmaz. */
final class ProductionText {

    private static final Locale TURKISH = Locale.forLanguageTag("tr-TR");

    private ProductionText() {
    }

    static String tidy(String text) {
        return text == null || text.isBlank() ? null : text.trim();
    }

    static String number(BigDecimal value) {
        return format("#,##0.###", value);
    }

    static String percent(double value) {
        return "%" + format("#,##0.#", BigDecimal.valueOf(value));
    }

    /**
     * Saha'ya yansıyan girişin yazısı; Saha'da başlık, sohbet listesinde önizleme olur:
     * "📐 İmalat · Demir İşleri: +3,5 ton · 62 / 120 ton (%51,7)" ve varsa altında not.
     */
    static String fieldBody(ProductionItem item, ProductionEntry entry, ProductionFigures after) {
        String unit = item.getUnit();
        String line = "📐 İmalat · %s: +%s %s · %s / %s %s (%s)".formatted(item.name(), number(entry.getQuantity()),
            unit, number(after.done()), number(after.total()), unit, percent(after.percent()));
        return entry.getNote() == null ? line : line + "\n" + entry.getNote();
    }

    /** DecimalFormat iş parçacığına güvenli değildir: her yazışta yenisi kurulur. */
    private static String format(String pattern, BigDecimal value) {
        return new DecimalFormat(pattern, DecimalFormatSymbols.getInstance(TURKISH)).format(value);
    }
}
