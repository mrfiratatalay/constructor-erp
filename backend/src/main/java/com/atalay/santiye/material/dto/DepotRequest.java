package com.atalay.santiye.material.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/** Yeni depo ("Ana Depo", "Kartal Deposu"). Şantiyeler lokasyon olarak kendiliğinden gelir. */
public record DepotRequest(@NotBlank @Size(max = 120) String name) {
}
