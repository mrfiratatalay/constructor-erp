package com.atalay.santiye.material.dto;

import jakarta.annotation.Nullable;
import java.util.List;

/** Sevkiyatın ayrıntısı: künyesi, kalemleri, irsaliyeleri, Saha izi ve değişmez geçmişi. */
public record ShipmentDetail(
    ShipmentRow row,
    @Nullable String description,
    String createdByName,
    List<DocumentView> documents,
    List<HistoryEntry> history) {
}
