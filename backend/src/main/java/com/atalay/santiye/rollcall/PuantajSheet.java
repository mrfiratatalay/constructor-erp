package com.atalay.santiye.rollcall;

import com.atalay.santiye.rollcall.dto.MemberCalendarDay;
import com.atalay.santiye.rollcall.dto.RollCallCounts;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
import org.dhatim.fastexcel.Worksheet;

/**
 * "Puantaj" sayfası, şantiyelerin alışık olduğu cetvel: satırda kişi, sütunda ayın günleri, hücrede G / Y / İ / K
 * takvimdeki renklerle; sağda ayın toplamları. Yoklama alınmayan gün boş kalır.
 */
final class PuantajSheet {

    static final String HEADER_FILL = "1E3A5F";
    private static final int HEADER_ROW = 2;
    private static final List<String> TOTALS = List.of("Geldi", "Gelmedi", "İzinli", "Katılmadı");
    private static final String LEGEND =
        "G: Geldi · Y: Gelmedi · İ: İzinli · K: Katılmadı (o gün yoklama vardı, kaydı yok) · Boş: yoklama alınmadı";
    private static final DateTimeFormatter MONTH_TITLE =
        DateTimeFormatter.ofPattern("MMMM yyyy", Locale.forLanguageTag("tr"));

    private PuantajSheet() {
    }

    static void write(Worksheet sheet, YearMonth month, List<ExportRow> rows) {
        int days = month.lengthOfMonth();
        sheet.value(0, 0, MONTH_TITLE.format(month) + " yoklaması");
        sheet.style(0, 0).bold().fontSize(14).set();
        writeHeader(sheet, days);
        for (int index = 0; index < rows.size(); index++) {
            writeRow(sheet, HEADER_ROW + 1 + index, days, rows.get(index));
        }
        sheet.value(HEADER_ROW + rows.size() + 2, 0, LEGEND);
        sheet.width(0, 26);
        for (int day = 1; day <= days; day++) {
            sheet.width(day, 4);
        }
        sheet.freezePane(1, HEADER_ROW + 1);
    }

    private static void writeHeader(Worksheet sheet, int days) {
        sheet.value(HEADER_ROW, 0, "Ad Soyad");
        for (int day = 1; day <= days; day++) {
            sheet.value(HEADER_ROW, day, day);
        }
        for (int index = 0; index < TOTALS.size(); index++) {
            sheet.value(HEADER_ROW, days + 1 + index, TOTALS.get(index));
            sheet.width(days + 1 + index, 11);
        }
        sheet.range(HEADER_ROW, 0, HEADER_ROW, days + TOTALS.size()).style()
            .bold().fillColor(HEADER_FILL).fontColor("FFFFFF").horizontalAlignment("center").set();
    }

    private static void writeRow(Worksheet sheet, int row, int days, ExportRow member) {
        sheet.value(row, 0, member.fullName());
        for (MemberCalendarDay day : member.days()) {
            DayMark mark = DayMark.of(day.record());
            int column = day.day().getDayOfMonth();
            sheet.value(row, column, mark.letter());
            sheet.style(row, column).fillColor(mark.fill()).horizontalAlignment("center").set();
        }
        RollCallCounts counts = member.counts();
        List<Long> totals = List.of(counts.present(), counts.absent(), counts.excused(), counts.missing());
        for (int index = 0; index < totals.size(); index++) {
            sheet.value(row, days + 1 + index, totals.get(index));
        }
    }
}
