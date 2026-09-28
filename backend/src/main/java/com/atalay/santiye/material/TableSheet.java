package com.atalay.santiye.material;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import org.dhatim.fastexcel.Worksheet;

/**
 * Düz bir Excel tablosu: lacivert başlık satırı, sabit ilk satır, süzgeç düğmeleri. Tarih gerçek tarih, miktar gerçek
 * sayı olarak yazılır (Excel sıralar ve toplar); boş bilgi hücreye yazılmaz.
 */
final class TableSheet {

    private static final String HEADER_FILL = "172554";

    record Column(String title, int width) {
    }

    /** Yazılan sayfa ve anları yerel saate çevirmek için saat dilimi. */
    private record Target(Worksheet sheet, ZoneId zone) {
    }

    private TableSheet() {
    }

    static void write(Worksheet sheet, List<Column> columns, List<List<Object>> rows, ZoneId zone) {
        for (int column = 0; column < columns.size(); column++) {
            sheet.value(0, column, columns.get(column).title());
            sheet.width(column, columns.get(column).width());
        }
        sheet.range(0, 0, 0, columns.size() - 1).style().bold().fillColor(HEADER_FILL).fontColor("FFFFFF").set();
        Target target = new Target(sheet, zone);
        for (int row = 0; row < rows.size(); row++) {
            List<Object> values = rows.get(row);
            for (int column = 0; column < values.size(); column++) {
                cell(target, row + 1, column, values.get(column));
            }
        }
        sheet.freezePane(0, 1);
        if (!rows.isEmpty()) {
            sheet.setAutoFilter(0, 0, columns.size() - 1);
        }
    }

    private static void cell(Target target, int row, int column, Object value) {
        Worksheet sheet = target.sheet();
        switch (value) {
            case null -> { }
            case LocalDate day -> {
                sheet.value(row, column, day);
                sheet.style(row, column).format("dd.mm.yyyy").set();
            }
            case Instant at -> {
                sheet.value(row, column, at.atZone(target.zone()).toLocalDateTime());
                sheet.style(row, column).format("dd.mm.yyyy hh:mm").set();
            }
            case BigDecimal number -> sheet.value(row, column, number);
            case Number number -> sheet.value(row, column, number);
            default -> sheet.value(row, column, value.toString());
        }
    }
}
