package com.atalay.santiye.team;

import java.util.Arrays;
import java.util.Locale;
import java.util.stream.Collectors;

/**
 * Ad soyad Türkçe kurallarıyla yazılır: "FIRAT ATALAY" ve "musa kusbey" → "Fırat Atalay", "Musa Kusbey".
 * Yalnızca tamamı büyük ya da tamamı küçük kelimeye dokunulur; "McAllister" gibi bilerek karışık
 * yazılmış ad olduğu gibi kalır. Liste, girilen yazıma göre dağınık görünmesin diye.
 */
public final class PersonNames {

    private static final Locale TURKISH = Locale.forLanguageTag("tr");

    private PersonNames() {
    }

    public static String tidy(String fullName) {
        return Arrays.stream(fullName.trim().split("\\s+"))
            .map(PersonNames::tidyWord)
            .collect(Collectors.joining(" "));
    }

    private static String tidyWord(String word) {
        String lower = word.toLowerCase(TURKISH);
        boolean uniform = word.equals(lower) || word.equals(word.toUpperCase(TURKISH));
        if (!uniform || lower.isEmpty()) {
            return word;
        }
        return lower.substring(0, 1).toUpperCase(TURKISH) + lower.substring(1);
    }
}
