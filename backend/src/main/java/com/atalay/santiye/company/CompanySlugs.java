package com.atalay.santiye.company;

import java.text.Normalizer;
import java.util.Locale;
import org.springframework.stereotype.Component;

/**
 * Firmanın okunur adresi ("kizilkan-insaat"): platform yönetiminde ve ileride alt alan adında kullanılır. Türkçe
 * harfler sadeleşir, aynı ad ikinci kez gelirse sonuna sayı eklenir. Kimlik değildir; firma kimliği her zaman id'dir.
 */
@Component
public class CompanySlugs {

    private static final int MAX_LENGTH = 50;

    private final CompanyRepository companies;

    CompanySlugs(CompanyRepository companies) {
        this.companies = companies;
    }

    public String uniqueFor(String name) {
        String base = baseOf(name);
        String candidate = base;
        for (int suffix = 2; companies.existsBySlug(candidate); suffix++) {
            candidate = base + "-" + suffix;
        }
        return candidate;
    }

    static String baseOf(String name) {
        String ascii = name.toLowerCase(Locale.forLanguageTag("tr"))
            .replace('ı', 'i').replace('ğ', 'g').replace('ü', 'u').replace('ş', 's').replace('ö', 'o').replace('ç', 'c');
        String plain = Normalizer.normalize(ascii, Normalizer.Form.NFD).replaceAll("\\p{M}", "");
        String slug = plain.replaceAll("[^a-z0-9]+", "-").replaceAll("(^-+|-+$)", "");
        slug = slug.length() > MAX_LENGTH ? slug.substring(0, MAX_LENGTH).replaceAll("-+$", "") : slug;
        return slug.isEmpty() ? "firma" : slug;
    }
}
