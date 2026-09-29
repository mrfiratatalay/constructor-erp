package com.atalay.santiye.material.dto;

import com.atalay.santiye.material.LocationKind;
import jakarta.annotation.Nullable;
import java.util.UUID;

/** Stok lokasyonu: depo ya da şantiye. active: tamamlanmış şantiye yeni hareket seçeneklerinin sonunda durur. */
public record LocationView(UUID id, LocationKind kind, String name, @Nullable UUID siteId, boolean active) {
}
