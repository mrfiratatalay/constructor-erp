package com.atalay.santiye.puantaj;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.common.error.ApiException;
import java.time.Clock;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import org.springframework.stereotype.Component;

/**
 * Hangi gün işaretlenir? "Bugün" firmanın saatine göredir. Şef yalnızca bugünü işaretler; geçmiş bir günü patron
 * düzeltir (şef geçmişe dönüp puantajla oynayamaz). İleri bir günün yoklaması alınmaz.
 */
@Component
class PuantajDays {

    /** Bir okumada en çok iki ay: ayın cetveli ve bir önceki haftayla birlikte bugünün ekranı sığar. */
    private static final long MAX_RANGE_DAYS = 62;

    private final Clock clock;

    PuantajDays(Clock clock) {
        this.clock = clock;
    }

    LocalDate today() {
        return LocalDate.now(clock);
    }

    void requireEditable(CurrentUser user, LocalDate day) {
        LocalDate today = today();
        if (day.isAfter(today)) {
            throw ApiException.badRequest("İleri bir günün yoklaması alınmaz.");
        }
        if (!user.isOwner() && day.isBefore(today)) {
            throw ApiException.forbidden("Geçmiş bir günü yalnızca patron düzeltebilir.");
        }
    }

    static void requireRange(LocalDate from, LocalDate to) {
        if (to.isBefore(from) || ChronoUnit.DAYS.between(from, to) >= MAX_RANGE_DAYS) {
            throw ApiException.badRequest("Tarih aralığı hatalı.");
        }
    }
}
