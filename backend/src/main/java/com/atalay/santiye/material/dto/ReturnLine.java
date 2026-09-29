package com.atalay.santiye.material.dto;

import com.atalay.santiye.material.MovementStatus;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

/** Ödünç çıkışına bağlı bir iade: ne zaman, ne kadar, nereye döndü. */
public record ReturnLine(UUID id, long number, LocalDate day, BigDecimal quantity, MovementStatus status,
    String destinationName) {
}
