package com.atalay.santiye.production.dto;

import java.util.List;

/**
 * Şantiyenin İmalat sekmesi tek istekte: imalatlar (açıldıkları sırayla) ve son günlük girişler (en yeni 20).
 * Özet kartları ve filtreler bu listeden ekranda sayılır.
 */
public record ProductionBoardView(List<ProductionItemView> items, List<ProductionEntryView> recentEntries) {
}
