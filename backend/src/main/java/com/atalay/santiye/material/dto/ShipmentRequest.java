package com.atalay.santiye.material.dto;

import jakarta.annotation.Nullable;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

/**
 * Yeni sevkiyat. Kullanıcı hareketin türünü seçmez: yalnızca iki ucu söyler, adını sunucu koyar. Çıkış yeri
 * boşsa malzeme dışarıdan geliyordur, varış yeri boşsa dışarı gidiyordur; o uçta firma (party) vardır.
 * expectsReturn yalnızca dışarı verilende sorulur: "geri gelecek mi?".
 */
public record ShipmentRequest(
    @NotNull UUID id,
    @Nullable UUID sourceId,
    @Nullable UUID destinationId,
    @Nullable UUID partyId,
    @Nullable @Size(max = 120) String partyName,
    @Nullable UUID returnOfId,
    boolean expectsReturn,
    @Nullable LocalDate day,
    @Nullable @Size(max = 500) String description,
    @NotEmpty @Size(max = 100) List<@Valid ShipmentLineRequest> lines) {
}
