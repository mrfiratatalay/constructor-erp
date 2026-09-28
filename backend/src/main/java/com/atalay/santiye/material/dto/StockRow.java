package com.atalay.santiye.material.dto;

import com.atalay.santiye.material.StockStatus;
import jakarta.annotation.Nullable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

/**
 * Malzemenin şu anki durumu, hareketlerden: available lokasyonlardaki kullanılabilir toplam, locations lokasyon
 * kırılımı (yalnızca stoğu olanlar, önce depolar). inTransit yolda, pendingCheck kontrol bekleyen, outside ödünç
 * verilip henüz dönmemiş miktar; bunlar kullanılabilire dahil değildir. status: minStock'a göre kritik ya da tükendi.
 */
public record StockRow(
    UUID materialId,
    String name,
    @Nullable String code,
    String category,
    String unit,
    @Nullable BigDecimal minStock,
    boolean active,
    BigDecimal available,
    BigDecimal inTransit,
    BigDecimal pendingCheck,
    BigDecimal outside,
    List<StockCell> locations,
    @Nullable LocalDate lastMovementDay,
    StockStatus status) {
}
