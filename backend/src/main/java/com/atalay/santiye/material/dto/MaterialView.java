package com.atalay.santiye.material.dto;

import jakarta.annotation.Nullable;
import java.math.BigDecimal;
import java.util.UUID;

/** Malzeme kartı; stok ayrıca hesaplanır (StockRow). */
public record MaterialView(
    UUID id,
    String name,
    @Nullable String code,
    String category,
    String unit,
    @Nullable BigDecimal minStock,
    @Nullable String description,
    boolean active) {
}
