package com.atalay.santiye.material.dto;

import com.atalay.santiye.material.LocationKind;
import java.math.BigDecimal;
import java.util.UUID;

/** Malzemenin bir lokasyondaki kullanılabilir miktarı: "Ana Depo 900". */
public record StockCell(UUID locationId, String name, LocationKind kind, BigDecimal quantity) {
}
