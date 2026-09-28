package com.atalay.santiye.material;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

/** Malzemenin lokasyonlarda olmayan miktarları ve son hareket günü (stok görünümü için). */
record StockExtras(UUID materialId, BigDecimal inTransit, BigDecimal pendingCheck, BigDecimal outside,
    LocalDate lastDay) {

    static StockExtras none(UUID materialId) {
        return new StockExtras(materialId, BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO, null);
    }
}
