package com.atalay.santiye.material.dto;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

/** Kaydedilmiş hareketin düzeltilebilir alanları; rota ve kalemler değişmez. */
public record ShipmentEditRequest(@NotNull LocalDate day, @Nullable @Size(max = 500) String description) {
}
