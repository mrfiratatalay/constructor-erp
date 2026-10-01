package com.atalay.santiye.material;

import com.atalay.santiye.common.error.ApiException;
import com.atalay.santiye.material.dto.ShipmentReportFilter;
import com.atalay.santiye.material.dto.ShipmentRow;
import java.util.List;
import java.util.Objects;
import java.util.function.Predicate;

/** Dökümün her seçimi diğerleriyle birlikte uygulanır; tarih sınırları seçilen günü kapsar. */
final class ShipmentReportFilters {

    private ShipmentReportFilters() {
    }

    static List<ShipmentRow> apply(List<ShipmentRow> rows, ShipmentReportFilter filter) {
        requireDates(filter);
        Predicate<ShipmentRow> scope = scopeOf(filter.scope());
        return rows.stream().filter(scope)
            .filter(row -> filter.fromDay() == null || !row.day().isBefore(filter.fromDay()))
            .filter(row -> filter.toDay() == null || !row.day().isAfter(filter.toDay()))
            .filter(row -> filter.type() == null || row.type() == filter.type())
            .filter(row -> atPoint(row, filter.point())).toList();
    }

    private static void requireDates(ShipmentReportFilter filter) {
        if (filter.fromDay() != null && filter.toDay() != null && filter.fromDay().isAfter(filter.toDay())) {
            throw ApiException.badRequest("Başlangıç tarihi bitiş tarihinden sonra olamaz.");
        }
    }

    private static boolean atPoint(ShipmentRow row, String point) {
        return point == null || point.isBlank()
            || Objects.equals(row.fromName(), point) || Objects.equals(row.toName(), point);
    }

    private static Predicate<ShipmentRow> scopeOf(String scope) {
        return switch (scope == null || scope.isBlank() ? "all" : scope) {
            case "all" -> row -> true;
            case "sites" -> ShipmentReportFilters::atSite;
            case "external" -> row -> hasKind(row, "EXTERNAL");
            case "returns" -> ShipmentRow::awaitingReturn;
            default -> throw ApiException.badRequest("Hareket görünümü geçersiz.");
        };
    }

    private static boolean atSite(ShipmentRow row) {
        return hasKind(row, "SITE") || (row.fromKind() == null && row.toKind() == null
            && (row.type() == ShipmentType.TO_SITE || row.type() == ShipmentType.TRANSFER));
    }

    private static boolean hasKind(ShipmentRow row, String kind) {
        return kind.equals(row.fromKind()) || kind.equals(row.toKind());
    }
}
