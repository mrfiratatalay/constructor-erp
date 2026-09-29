package com.atalay.santiye.material.dto;

import java.util.UUID;

/** Malzeme kartı: ad ve birim. Kategori ve kritik eşik kalktı; stok sayısı ayrıca hesaplanır (StockLevel). */
public record MaterialView(UUID id, String name, String unit, boolean active) {
}
