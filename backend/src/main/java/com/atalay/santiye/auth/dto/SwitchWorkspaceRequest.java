package com.atalay.santiye.auth.dto;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

/** Geçilmek istenen firma; sunucu kişinin o firmada aktif üyeliği olup olmadığına bakar. */
public record SwitchWorkspaceRequest(@NotNull UUID companyId) {
}
