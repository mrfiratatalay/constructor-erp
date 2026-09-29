package com.atalay.santiye.production.dto;

import jakarta.annotation.Nullable;
import java.util.UUID;

/** İmalatın taşeronu: puantajın ekibi. archived: yoklama listesinden çıkmış; yeni imalata seçilmez. */
public record CrewRef(UUID id, String name, @Nullable String trade, boolean archived) {
}
