package com.atalay.santiye.material.dto;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.util.UUID;

/** Sevkiyatın bir kalemi: hangi malzemeden ne kadar. */
public record ShipmentLineRequest(
    @NotNull UUID materialId,
    @NotNull @Positive @Digits(integer = 11, fraction = 3) BigDecimal quantity) {
}
