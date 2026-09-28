package com.atalay.santiye.puantaj.dto;

import com.atalay.santiye.puantaj.DayStatus;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;
import java.util.UUID;

/** Şef listeden birkaç kişiyi seçip tek hamlede işaretler; notları yerinde kalır. */
public record BulkMarkRequest(
    @NotEmpty @Size(max = 300) List<UUID> entryIds,
    @NotNull DayStatus status) {
}
