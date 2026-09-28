package com.atalay.santiye.material.dto;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

/**
 * Hareketin sonradan düzeltilebilen bilgileri: açıklama, kullanım alanı, ödünçte beklenen iade tarihi ve notu.
 * Miktar, malzeme ve lokasyon değişmez; yanlışsa hareket iptal edilip yenisi girilir. Değişiklik geçmişe yazılır.
 */
public record MovementUpdateRequest(
    @Nullable @Size(max = 500) String description,
    @Nullable @Size(max = 120) String usageArea,
    @Nullable LocalDate expectedReturnDate,
    @Nullable @Size(max = 300) String returnNote) {
}
