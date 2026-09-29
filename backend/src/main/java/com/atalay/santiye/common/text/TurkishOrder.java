package com.atalay.santiye.common.text;

import java.text.Collator;
import java.util.Locale;

/**
 * Adların Türkçe alfabe sırası: Çetin, Ceren'in ardından; İnşaat, Işık'tan sonra gelir. Java'da COLLATOR, SQL'de
 * SQL_COLLATION ("name collate ..."); veritabanının kendi dili (en_US) Ç, Ş, İ'yi yanlış yere koyar.
 */
public final class TurkishOrder {

    public static final Collator COLLATOR = Collator.getInstance(Locale.forLanguageTag("tr"));

    /** PostgreSQL'in ICU ile gelen Türkçe sıralaması. */
    public static final String SQL_COLLATION = "collate \"tr-TR-x-icu\"";

    private TurkishOrder() {
    }
}
