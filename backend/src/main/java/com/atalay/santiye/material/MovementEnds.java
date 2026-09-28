package com.atalay.santiye.material;

import com.atalay.santiye.material.dto.LocationRef;
import com.atalay.santiye.material.dto.MovementRow;

/**
 * Tablodaki "Nereden" ve "Nereye": lokasyon yoksa türün anlamı yazılır. Geldi'nin kaynağı tedarikçidir, kullanımın
 * hedefi kullanım alanıdır, dışarı verilenin hedefi firmadır; sayım farkı "Sayım" der.
 */
final class MovementEnds {

    private MovementEnds() {
    }

    static String from(MovementRow row) {
        if (row.source() != null) {
            return row.source().name();
        }
        return switch (row.type()) {
            case INBOUND, RETURN -> row.partyName() == null ? "Tedarikçi" : row.partyName();
            case ADJUSTMENT -> "Sayım";
            default -> null;
        };
    }

    static String to(MovementRow row) {
        LocationRef destination = row.destination();
        if (destination != null) {
            return destination.name();
        }
        return switch (row.type()) {
            case USED -> row.usageArea() == null ? "Kullanım" : row.usageArea();
            case OUTBOUND -> row.partyName();
            case ADJUSTMENT -> "Sayım farkı";
            default -> null;
        };
    }
}
