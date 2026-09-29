package com.atalay.santiye.material.dto;

import com.atalay.santiye.material.ShipmentEventKind;
import jakarta.annotation.Nullable;
import java.time.Instant;
import java.util.UUID;

/** Sevkiyatın geçmişinden bir satır: ne oldu, kim yaptı, ne zaman; iptalde nedeni, belgede dosya adı. */
public record HistoryEntry(UUID shipmentId, ShipmentEventKind kind, String actorName, @Nullable String note,
    Instant at) {
}
