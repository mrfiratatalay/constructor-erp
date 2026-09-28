package com.atalay.santiye.task.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

/**
 * Fotoğrafın üstünde eksik olan yer: hangi fotoğraf ve noktanın yeri. x ve y fotoğrafın genişliğine ve yüksekliğine
 * göre 0-1 arasıdır; ekran boyutundan bağımsızdır, her telefonda aynı yere düşer.
 */
public record DeliveryMark(
    @NotNull UUID mediaId,
    @NotNull @DecimalMin("0") @DecimalMax("1") Float x,
    @NotNull @DecimalMin("0") @DecimalMax("1") Float y) {
}
