package com.atalay.santiye.material;

import com.atalay.santiye.material.dto.MovementRow;
import com.atalay.santiye.material.dto.ReturnRow;
import com.atalay.santiye.material.dto.StockCell;
import com.atalay.santiye.material.dto.StockRow;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

/** Excel sayfalarının sütunları ve satırları: ekrandaki tablolarla aynı adlar, aynı sıra. */
final class ReportRows {

    static final List<TableSheet.Column> MOVEMENT_COLUMNS = columns("Hareket No:14", "Tarih:12", "Malzeme:24",
        "Kategori:14", "Hareket Türü:20", "Nereden:22", "Nereye:22", "Firma / Kişi:22", "Veriliş Amacı:18",
        "Miktar:11", "Birim:9", "Durum:20", "Açıklama:36", "Kaydı Giren:18", "Oluşturma Zamanı:18");
    static final List<TableSheet.Column> RETURN_COLUMNS = columns("Hareket No:14", "Veriliş Tarihi:14", "Firma:24",
        "Malzeme:24", "Birim:9", "Verilen:11", "İade Edilen:12", "Kalan:11", "Beklenen Tarih:15", "Gecikme (gün):14",
        "Durum:18", "Nereden:22", "Geri Dönüş Notu:36");

    private ReportRows() {
    }

    static List<Object> movement(MovementRow row) {
        return Arrays.asList(Quantities.number(row.number()), row.day(), row.materialName(), row.category(),
            MovementLabels.type(row.type()), MovementEnds.from(row), MovementEnds.to(row), row.partyName(),
            MovementLabels.purpose(row.purpose()), row.quantity(), row.unit(), MovementLabels.status(row.status()),
            row.description(), row.createdByName(), row.createdAt());
    }

    static List<Object> awaitingReturn(ReturnRow row, LocalDate today) {
        Long late = row.expectedReturnDate() != null && row.expectedReturnDate().isBefore(today)
            ? ChronoUnit.DAYS.between(row.expectedReturnDate(), today) : null;
        return Arrays.asList(Quantities.number(row.number()), row.day(), row.partyName(), row.materialName(),
            row.unit(), row.quantity(), row.returned(), row.remaining(), row.expectedReturnDate(), late,
            MovementLabels.status(row.status()), row.sourceName(), row.returnNote());
    }

    /** Stok sayfası: sabit sütunlar, arada stoğu olan her lokasyon için bir sütun. */
    static List<TableSheet.Column> stockColumns(List<String> places) {
        List<TableSheet.Column> columns = new ArrayList<>(columns("Malzeme:24", "Kod:12", "Kategori:14", "Birim:9",
            "Kullanılabilir:14"));
        places.forEach(place -> columns.add(new TableSheet.Column(place, Math.max(12, place.length() + 2))));
        columns.addAll(columns("Yolda:10", "Kontrol Bekleyen:16", "Dışarıda (Ödünç):16", "Kritik Eşik:12",
            "Durum:10", "Son Hareket:13"));
        return columns;
    }

    static List<Object> stock(StockRow row, List<String> places) {
        Map<String, BigDecimal> byPlace = row.locations().stream()
            .collect(Collectors.toMap(StockCell::name, StockCell::quantity, BigDecimal::add));
        List<Object> values = new ArrayList<>(Arrays.asList(row.name(), row.code(), row.category(), row.unit(),
            row.available()));
        places.forEach(place -> values.add(byPlace.get(place)));
        values.addAll(Arrays.asList(row.inTransit(), row.pendingCheck(), row.outside(), row.minStock(),
            MovementLabels.stock(row.status()), row.lastMovementDay()));
        return values;
    }

    static boolean stockMatches(StockRow row, UUID materialId, String category, UUID locationId) {
        return (materialId == null || row.materialId().equals(materialId))
            && (category == null || row.category().equals(category))
            && (locationId == null || row.locations().stream().anyMatch(cell -> cell.locationId().equals(locationId)));
    }

    private static List<TableSheet.Column> columns(String... specs) {
        return Arrays.stream(specs).map(spec -> {
            int colon = spec.lastIndexOf(':');
            return new TableSheet.Column(spec.substring(0, colon), Integer.parseInt(spec.substring(colon + 1)));
        }).toList();
    }
}
