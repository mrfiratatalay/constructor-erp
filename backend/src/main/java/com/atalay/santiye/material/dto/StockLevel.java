package com.atalay.santiye.material.dto;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * Bir malzemenin bir yerdeki kalan miktarı. Ayrı bir stok ekranı yoktur: bu sayı yalnızca sevkiyat çıkarılırken
 * malzemenin altında tek satır olarak görünür ("Depoda: 300 Torba").
 */
public record StockLevel(UUID materialId, BigDecimal quantity) {
}
