package com.atalay.santiye.material.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/** Sevkiyat silinmez, iptal edilir; nedeni zorunludur ve geçmişte kalır. */
public record CancelRequest(@NotBlank @Size(max = 300) String reason) {
}
