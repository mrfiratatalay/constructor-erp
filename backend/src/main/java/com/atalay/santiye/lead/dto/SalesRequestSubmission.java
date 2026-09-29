package com.atalay.santiye.lead.dto;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.UUID;

/**
 * Tanıtım sitesindeki başvuru formu. website bir tuzaktır: formda gizlidir, insan doldurmaz; dolu gelirse istek
 * sessizce yok sayılır (bot).
 */
public record SalesRequestSubmission(
    @NotBlank @Size(max = 120) String companyName,
    @NotBlank @Size(max = 120) String contactName,
    @NotBlank @Size(max = 20) String phone,
    @Nullable @Email @Size(max = 254) String email,
    @Nullable @Size(max = 60) String city,
    @Nullable @Min(0) @Max(999) Integer siteCount,
    @Nullable UUID planId,
    @Nullable @Size(max = 1000) String message,
    @Nullable String website) {
}
