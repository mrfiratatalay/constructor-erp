package com.atalay.santiye.platform.dto;

import com.atalay.santiye.company.CompanyStatus;
import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/** Firmayı askıya al, arşivle ya da yeniden aç. Silme yoktur; reason işlem geçmişine yazılır. */
public record ChangeTenantStatusRequest(@NotNull CompanyStatus status, @Nullable @Size(max = 300) String reason) {
}
