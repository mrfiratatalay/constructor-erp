package com.atalay.santiye.join.dto;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.Size;

/** Oturumu açık olmayan kişi adını ve numarasını kendisi yazar; oturumu açıksa ikisi de boş gelir. */
public record JoinSiteRequest(
    @Nullable @Size(max = 120) String fullName,
    @Nullable @Size(max = 20) String phone) {
}
