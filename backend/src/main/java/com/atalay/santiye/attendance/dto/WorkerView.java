package com.atalay.santiye.attendance.dto;

import jakarta.annotation.Nullable;
import java.util.UUID;

/** trade: görevi (kalıpçı, demirci…); girilmediyse yok. */
public record WorkerView(UUID id, String fullName, @Nullable String trade) {
}
