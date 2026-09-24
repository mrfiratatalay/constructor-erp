package com.atalay.santiye.join.dto;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.Size;

/** Bağlantıyı açan kişi adını ve numarasını kendisi yazar; bu telefonda zaten içerideyse ikisi de boş gelir. */
public record JoinRequest(
    @Nullable @Size(max = 120) String fullName,
    @Nullable @Size(max = 20) String phone) {
}
