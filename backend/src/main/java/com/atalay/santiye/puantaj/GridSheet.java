package com.atalay.santiye.puantaj;

import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
import org.dhatim.fastexcel.Worksheet;

/**
 * Şantiyelerin alışık olduğu cetvel: solda ad ve görev, ortada ayın günleri (renkli harf), sağda toplamlar.
 * Personel ve Ekipler sayfaları aynı biçimdedir, yalnızca başlıkları ve toplamları farklıdır.
 */
final class GridSheet {

    private static final int HEADER_ROW = 2;
    private static final int FIRST_DAY_COLUMN = 2;
    private static final DateTimeFormatter MONTH_TITLE =
        DateTimeFormatter.ofPattern("MMMM yyyy", Locale.forLanguageTag("tr"));

    /** Sayfanın başlıkları: ilk iki sütun (ör. "Ad Soyad", "Görev") ve sağdaki toplamların adları. */
    record Layout(String title, List<String> leading, List<String> totals) {
    }

    /** Bir satır: ad, görev, ayın işaretli günleri ve toplamlar (Excel sayıyı kendi biçimiyle yazar: 1,5). */
    record Row(String name, String detail, List<DayMark> marks, List<Number> totals) {
    }

    private GridSheet() {
    }

    static void write(Worksheet sheet, YearMonth month, Layout layout, List<Row> rows) {
        int days = month.lengthOfMonth();
        sheet.value(0, 0, MONTH_TITLE.format(month) + " · " + layout.title());
        sheet.style(0, 0).bold().fontSize(14).set();
        writeHeader(sheet, days, layout);
        for (int index = 0; index < rows.size(); index++) {
            writeRow(sheet, HEADER_ROW + 1 + index, days, rows.get(index));
        }
        sheet.value(HEADER_ROW + rows.size() + 2, 0, SheetMarks.LEGEND);
        sheet.width(0, 26);
        sheet.width(1, 16);
        for (int day = 1; day <= days; day++) {
            sheet.width(FIRST_DAY_COLUMN + day - 1, 5);
        }
        sheet.freezePane(FIRST_DAY_COLUMN, HEADER_ROW + 1);
    }

    private static void writeHeader(Worksheet sheet, int days, Layout layout) {
        sheet.value(HEADER_ROW, 0, layout.leading().get(0));
        sheet.value(HEADER_ROW, 1, layout.leading().get(1));
        for (int day = 1; day <= days; day++) {
            sheet.value(HEADER_ROW, FIRST_DAY_COLUMN + day - 1, day);
        }
        int totalsColumn = FIRST_DAY_COLUMN + days;
        for (int index = 0; index < layout.totals().size(); index++) {
            sheet.value(HEADER_ROW, totalsColumn + index, layout.totals().get(index));
            sheet.width(totalsColumn + index, 13);
        }
        sheet.range(HEADER_ROW, 0, HEADER_ROW, totalsColumn + layout.totals().size() - 1).style()
            .bold().fillColor(SheetMarks.HEADER_FILL).fontColor("FFFFFF").horizontalAlignment("center").set();
    }

    private static void writeRow(Worksheet sheet, int row, int days, Row line) {
        sheet.value(row, 0, line.name());
        if (line.detail() != null) {
            sheet.value(row, 1, line.detail());
        }
        for (DayMark mark : line.marks()) {
            int column = FIRST_DAY_COLUMN + mark.getDay().getDayOfMonth() - 1;
            sheet.value(row, column, SheetMarks.cell(mark));
            sheet.style(row, column).fillColor(SheetMarks.fill(mark.getStatus())).horizontalAlignment("center").set();
        }
        for (int index = 0; index < line.totals().size(); index++) {
            sheet.value(row, FIRST_DAY_COLUMN + days + index, line.totals().get(index));
        }
    }
}
