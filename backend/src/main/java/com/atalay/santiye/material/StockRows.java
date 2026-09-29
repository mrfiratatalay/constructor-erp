package com.atalay.santiye.material;

import com.atalay.santiye.material.dto.MaterialView;
import com.atalay.santiye.material.dto.StockCell;
import com.atalay.santiye.material.dto.StockRow;
import java.math.BigDecimal;
import java.util.List;

/** Stok satırını kurar: lokasyonların toplamı kullanılabilir stoktur; durum kritik eşiğe göre belirlenir. */
final class StockRows {

    private StockRows() {
    }

    static StockRow of(MaterialView material, List<StockCell> cells, StockExtras extras) {
        BigDecimal available = cells.stream().map(StockCell::quantity).reduce(BigDecimal.ZERO, BigDecimal::add);
        return new StockRow(material.id(), material.name(), material.code(), material.category(), material.unit(),
            material.minStock(), material.active(), available, extras.inTransit(), extras.pendingCheck(),
            extras.outside(), cells, extras.lastDay(), statusOf(available, material.minStock()));
    }

    private static StockStatus statusOf(BigDecimal available, BigDecimal minStock) {
        if (available.signum() <= 0) {
            return StockStatus.OUT;
        }
        if (minStock != null && available.compareTo(minStock) <= 0) {
            return StockStatus.CRITICAL;
        }
        return StockStatus.NORMAL;
    }
}
