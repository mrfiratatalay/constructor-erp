package com.atalay.santiye.platform.dto;

import com.atalay.santiye.billing.SubscriptionStatus;
import jakarta.validation.constraints.NotNull;

public record ChangeSubscriptionStatusRequest(@NotNull SubscriptionStatus status) {
}
