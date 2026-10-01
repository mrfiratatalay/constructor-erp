package com.atalay.santiye.material.dto;

import com.atalay.santiye.material.ShipmentType;
import jakarta.annotation.Nullable;
import java.time.LocalDate;
import org.springframework.format.annotation.DateTimeFormat;

/** Excel dökümü ekrandaki tarih, tür, nokta, görünüm ve arama seçimlerini uygular. */
public record ShipmentReportFilter(
    @Nullable String search,
    @Nullable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDay,
    @Nullable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDay,
    @Nullable ShipmentType type,
    @Nullable String point,
    @Nullable String scope) {
}
