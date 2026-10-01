package com.atalay.santiye.common.text;

import java.text.Collator;
import java.util.Locale;

/**
 * Türkçe alfabe sırası (Ç, Ş, Ö, Ü, İ yerinde): bellekte sıralanan adlar için. Veritabanındaki ad sütunları aynı işi
 * tr-x-icu kuralıyla yapar (V31). Collator'ın karşılaştırması eşzamanlı kullanıma açıktır.
 */
public final class TurkishOrder {

    public static final Collator NAMES = Collator.getInstance(Locale.forLanguageTag("tr"));

    private TurkishOrder() {
    }
}
