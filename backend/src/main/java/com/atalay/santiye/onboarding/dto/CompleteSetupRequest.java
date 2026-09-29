package com.atalay.santiye.onboarding.dto;

import jakarta.annotation.Nullable;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

/**
 * Sihirbazın bütün adımları tek istekte: firma, ilk patron, isteğe bağlı ilk şantiye. İlk şantiye zorunlu değildir:
 * kurulum hiçbir modüle bağımlı olmasın (şantiyesiz bir akış da tamamlanabilir).
 */
public record CompleteSetupRequest(
    @NotNull @Valid SetupCompany company,
    @NotNull @Valid SetupOwner owner,
    @Nullable @Valid SetupSite firstSite) {
}
