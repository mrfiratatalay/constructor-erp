package com.atalay.santiye.site.dto;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;
import java.util.UUID;

/** memberIds: kurarken seçilen katılımcılar (WhatsApp'ta grubu kurarken seçilen kişiler); boş olabilir. */
public record CreateSiteRequest(
    @NotBlank @Size(max = 120) String name,
    @Nullable @Size(max = 300) String address,
    @Nullable List<UUID> memberIds) {
}
