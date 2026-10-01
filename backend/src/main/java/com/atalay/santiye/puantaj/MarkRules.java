package com.atalay.santiye.puantaj;

import com.atalay.santiye.common.error.ApiException;
import com.atalay.santiye.puantaj.dto.MarkRequest;
import java.math.BigDecimal;

/**
 * Bir işaretin kuralları. Ekip yalnızca geldi ya da gelmedi olur, mesaisi yazılmaz. Mesai ayrı bir durum değil,
 * geldiği güne eklenen saattir: yarım saatlik adımlarla, en çok 16 saat. Boş not yazılmaz.
 */
final class MarkRules {

    private static final BigDecimal MAX_OVERTIME = BigDecimal.valueOf(16);
    private static final BigDecimal STEP = new BigDecimal("0.5");

    private MarkRules() {
    }

    static Marking checked(RosterKind kind, MarkRequest request) {
        requireStatus(kind, request.status());
        BigDecimal overtime = positiveOrNull(request.overtimeHours());
        if (overtime != null) {
            requireOvertime(kind, request.status(), overtime);
        }
        return new Marking(request.status(), overtime, tidy(request.note()));
    }

    static void requireStatus(RosterKind kind, DayStatus status) {
        if (!status.allowedFor(kind)) {
            throw ApiException.badRequest("Ekip için yalnızca Geldi ya da Gelmedi seçilir.");
        }
    }

    private static void requireOvertime(RosterKind kind, DayStatus status, BigDecimal overtime) {
        if (kind == RosterKind.CREW) {
            throw ApiException.badRequest("Ekibe mesai yazılmaz.");
        }
        if (status != DayStatus.PRESENT) {
            throw ApiException.badRequest("Mesai yalnızca Geldi gününe yazılır.");
        }
        // Önce büyüklük: bölme (remainder) devasa bir sayıda milyarlarca basamak hesaplar ve sunucuyu kilitler.
        if (overtime.compareTo(MAX_OVERTIME) > 0 || overtime.remainder(STEP).signum() != 0) {
            throw ApiException.badRequest("Mesai yarım saatlik adımlarla, en çok 16 saat yazılır.");
        }
    }

    private static BigDecimal positiveOrNull(BigDecimal hours) {
        return hours == null || hours.signum() <= 0 ? null : hours.stripTrailingZeros();
    }

    static String tidy(String text) {
        return text == null || text.isBlank() ? null : text.trim();
    }
}
