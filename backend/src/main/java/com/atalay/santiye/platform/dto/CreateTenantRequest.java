package com.atalay.santiye.platform.dto;

import jakarta.annotation.Nullable;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.util.UUID;

/**
 * Manuel satış: firma açılır, paketi ve dönemi tanımlanır, istenirse ödemesi kaydedilir, kurulum linki üretilir.
 * salesRequestId: firma bir başvurudan geldiyse o başvuru "kazanıldı" olur ve firmaya bağlanır.
 */
public record CreateTenantRequest(
    @NotBlank @Size(max = 120) String name,
    @Nullable @Size(max = 20) String phone,
    @Nullable @Size(max = 254) String email,
    @Nullable @Size(max = 60) String city,
    @NotNull UUID planId,
    @Min(1) @Max(36) int months,
    @Nullable LocalDate startsOn,
    @Nullable @Valid PaymentRequest payment,
    @Nullable UUID salesRequestId) {
}
