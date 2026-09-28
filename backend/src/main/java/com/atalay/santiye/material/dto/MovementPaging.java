package com.atalay.santiye.material.dto;

import com.atalay.santiye.material.MovementSort;
import com.atalay.santiye.material.SortDirection;
import jakarta.annotation.Nullable;

/** Sayfa (0'dan), sayfa boyu (en çok 100) ve sıralama; verilmezse en yeni hareket önde, 20'şer. */
public record MovementPaging(
    @Nullable Integer page,
    @Nullable Integer size,
    @Nullable MovementSort sort,
    @Nullable SortDirection direction) {
}
