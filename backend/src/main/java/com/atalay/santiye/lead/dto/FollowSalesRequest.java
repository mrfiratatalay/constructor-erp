package com.atalay.santiye.lead.dto;

import com.atalay.santiye.lead.SalesRequestStatus;
import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record FollowSalesRequest(@NotNull SalesRequestStatus status, @Nullable @Size(max = 1000) String notes) {
}
