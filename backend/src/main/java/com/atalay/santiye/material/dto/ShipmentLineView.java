package com.atalay.santiye.material.dto;

import java.math.BigDecimal;
import java.util.UUID;

/** Sevkiyatın bir kalemi, okunur haliyle: "Çimento · 300 Torba". */
public record ShipmentLineView(UUID materialId, String materialName, BigDecimal quantity, String unit) {
}
