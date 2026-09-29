package com.atalay.santiye.production.dto;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.multipart.MultipartFile;

/**
 * Günlük giriş ve dosyaları tek istekte (multipart). Kimliği istemci üretir: istek tekrar gelirse (internet koptu)
 * aynı giriş iki kez sayılmaz. quantity: bugün yapılan ("3.5"), 0 olabilir (çalışma yapılmadı). onField: Saha
 * akışına yansıt (varsayılan kapalı: Saha'yı çalışanlar da görür). files: fotoğraf ve PDF.
 */
public record ProductionEntryForm(
    @NotNull UUID id,
    @NotNull @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate day,
    @NotNull @PositiveOrZero @Digits(integer = 11, fraction = 3) BigDecimal quantity,
    @Nullable @Min(1) @Max(999) Integer workerCount,
    @Nullable @Size(max = 500) String note,
    boolean onField,
    @Nullable List<MultipartFile> files) {
}
