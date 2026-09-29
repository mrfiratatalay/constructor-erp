package com.atalay.santiye.production;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;

/**
 * Bir imalatın girişlerinden çıkan: toplam gerçekleşen, bugün girilen (aynı güne birden çok giriş toplanır) ve son
 * girişin zamanı ("Son güncelleme: Bugün 16:42"). Girişi olmayan imalatta sıfırdır.
 */
record ItemProgress(BigDecimal done, BigDecimal today, Instant lastEntryAt) {

    static final ItemProgress NONE = new ItemProgress(BigDecimal.ZERO, BigDecimal.ZERO, null);

    static ItemProgress of(ProductionEntryRepository.ProgressRow row) {
        return new ItemProgress(row.getDone(), row.getToday(), row.getLastEntryAt());
    }

    static ItemProgress of(List<ProductionEntry> entries, LocalDate today) {
        BigDecimal done = sum(entries);
        BigDecimal todays = sum(entries.stream().filter(entry -> entry.getDay().equals(today)).toList());
        Instant last = entries.stream().map(ProductionEntry::getCreatedAt).max(Comparator.naturalOrder()).orElse(null);
        return new ItemProgress(done, todays, last);
    }

    private static BigDecimal sum(List<ProductionEntry> entries) {
        return entries.stream().map(ProductionEntry::getQuantity).reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
