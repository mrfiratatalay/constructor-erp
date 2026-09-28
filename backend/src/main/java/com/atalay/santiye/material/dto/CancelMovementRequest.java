package com.atalay.santiye.material.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/** İptalin nedeni zorunludur: hareket silinmez, "İptal · neden · kim · ne zaman" olarak geçmişte kalır. */
public record CancelMovementRequest(@NotBlank @Size(max = 300) String reason) {
}
