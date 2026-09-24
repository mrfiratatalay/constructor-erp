package com.atalay.santiye.attendance.dto;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateWorkerRequest(@NotBlank @Size(max = 120) String fullName, @Nullable @Size(max = 80) String trade) {
}
