package com.atalay.santiye.material.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Malzeme kartı: ad ve ana birim. Ayrı bir malzeme ekranı yoktur; kart sevkiyat formunda adı yazılarak açılır.
 * active=false kartı pasifleştirir: yeni sevkiyatta seçilmez, geçmişi yerinde kalır.
 */
public record MaterialRequest(
    @NotBlank @Size(max = 120) String name,
    @NotBlank @Size(max = 20) String unit,
    boolean active) {
}
