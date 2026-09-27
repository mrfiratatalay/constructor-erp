package com.atalay.santiye.rollcall;

import com.atalay.santiye.rollcall.dto.DayRecord;
import com.atalay.santiye.rollcall.dto.MemberCalendarDay;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;
import org.dhatim.fastexcel.Worksheet;

/**
 * "Kayıtlar" sayfası: gün gün tam liste (Excel'de süzülür, sıralanır). Aynı günün kişileri ada göre sıralı kalır.
 * Tarih gerçek tarih olarak yazılır: Excel onu metin değil tarih diye sıralar.
 */
final class RecordsSheet {

    private static final List<String> HEADERS =
        List.of("Tarih", "Ad Soyad", "Durum", "Neden", "Şantiye", "Katılma saati", "İşaretleyen");
    private static final List<Integer> WIDTHS = List.of(12, 26, 11, 11, 24, 14, 18);
    private static final DateTimeFormatter TIME = DateTimeFormatter.ofPattern("HH:mm");

    private RecordsSheet() {
    }

    /** Bir satır: kimin, hangi günü. */
    private record Line(String fullName, MemberCalendarDay day) {
    }

    static void write(Worksheet sheet, List<ExportRow> rows, ZoneId zone) {
        for (int column = 0; column < HEADERS.size(); column++) {
            sheet.value(0, column, HEADERS.get(column));
            sheet.width(column, WIDTHS.get(column));
        }
        sheet.range(0, 0, 0, HEADERS.size() - 1).style()
            .bold().fillColor(PuantajSheet.HEADER_FILL).fontColor("FFFFFF").set();
        List<Line> lines = rows.stream()
            .flatMap(row -> row.days().stream().map(day -> new Line(row.fullName(), day)))
            .sorted(Comparator.comparing(line -> line.day().day()))
            .toList();
        for (int index = 0; index < lines.size(); index++) {
            writeLine(sheet, index + 1, lines.get(index), zone);
        }
        sheet.freezePane(0, 1);
    }

    private static void writeLine(Worksheet sheet, int row, Line line, ZoneId zone) {
        DayRecord record = line.day().record();
        DayMark mark = DayMark.of(record);
        sheet.value(row, 0, line.day().day());
        sheet.style(row, 0).format("dd.mm.yyyy").set();
        sheet.value(row, 1, line.fullName());
        sheet.value(row, 2, mark.label());
        sheet.style(row, 2).fillColor(mark.fill()).set();
        if (record == null) {
            return;
        }
        text(sheet, row, 3, DayMark.reasonLabel(record.reason()));
        text(sheet, row, 4, record.siteName());
        text(sheet, row, 5, clock(record.checkedInAt(), zone));
        text(sheet, row, 6, record.markedByName());
    }

    /** Boş bilgi hücreye yazılmaz: hücre boş kalır. */
    private static void text(Worksheet sheet, int row, int column, String value) {
        if (value != null) {
            sheet.value(row, column, value);
        }
    }

    private static String clock(Instant at, ZoneId zone) {
        return at == null ? null : TIME.format(at.atZone(zone));
    }
}
