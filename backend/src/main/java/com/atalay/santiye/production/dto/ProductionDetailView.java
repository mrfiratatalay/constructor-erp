package com.atalay.santiye.production.dto;

import java.util.List;

/** İmalatın detayı: kendisi ve bütün günlük girişleri, en yeni gün üstte. */
public record ProductionDetailView(ProductionItemView item, List<ProductionEntryView> entries) {
}
