package com.atalay.santiye.site.dto;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/** Yeni şantiye: ad ve isteğe bağlı adres. Kişi seçilmez; firmadaki herkes her şantiyededir. */
public record CreateSiteRequest(
    @NotBlank @Size(max = 120) String name,
    @Nullable @Size(max = 300) String address) {
}
