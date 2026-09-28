package com.atalay.santiye.material.dto;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

/**
 * Malzeme kartı: ad, kategori ve ana birim zorunlu; kod, kritik stok eşiği (minStock) ve açıklama isteğe bağlı.
 * active=false kartı pasifleştirir: yeni harekette seçilmez, geçmişi yerinde kalır.
 */
public record MaterialRequest(
    @NotBlank @Size(max = 120) String name,
    @Nullable @Size(max = 40) String code,
    @NotBlank @Size(max = 60) String category,
    @NotBlank @Size(max = 20) String unit,
    @Nullable @PositiveOrZero @Digits(integer = 11, fraction = 3) BigDecimal minStock,
    @Nullable @Size(max = 500) String description,
    boolean active) {
}
