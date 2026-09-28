package com.atalay.santiye.material.dto;

import com.atalay.santiye.material.MovementEventKind;
import jakarta.annotation.Nullable;
import java.time.Instant;

/** Hareketin geçmişinden bir satır: ne oldu, kim yaptı, ne zaman; iptalde nedeni, düzeltmede neyin değiştiği. */
public record HistoryEntry(MovementEventKind kind, String actorName, @Nullable String note, Instant at) {
}
