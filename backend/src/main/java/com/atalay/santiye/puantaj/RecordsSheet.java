package com.atalay.santiye.puantaj;

import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.dhatim.fastexcel.Worksheet;

/**
 * "Kayıtlar" sayfası: gün gün tam liste, notlar ve işaretleyen dahil (Excel'de süzülür, sıralanır). Aynı günün
 * kalemleri defterdeki sırayla kalır. Tarih gerçek tarih olarak yazılır: Excel onu metin değil tarih diye sıralar.
 */
final class RecordsSheet {

    private static final List<String> HEADERS =
        List.of("Tarih", "Tür", "Ad", "Görev / iş kolu", "Durum", "Mesai (saat)", "Not", "İşaretleyen", "Saat");
    private static final List<Integer> WIDTHS = List.of(12, 8, 26, 16, 11, 12, 36, 18, 8);
    private static final DateTimeFormatter TIME = DateTimeFormatter.ofPattern("HH:mm");

    private RecordsSheet() {
    }

    /** Yazılan sayfa ve adları, saatleri çözmek için gerekenler. */
    private record Target(Worksheet sheet, RosterPeople people, ZoneId zone) {
    }

    static void write(Worksheet sheet, Ledger book, ZoneId zone) {
        for (int column = 0; column < HEADERS.size(); column++) {
            sheet.value(0, column, HEADERS.get(column));
            sheet.width(column, WIDTHS.get(column));
        }
        sheet.range(0, 0, 0, HEADERS.size() - 1).style()
            .bold().fillColor(SheetMarks.HEADER_FILL).fontColor("FFFFFF").set();
        Map<UUID, RosterEntry> entries = book.entries().stream()
            .collect(Collectors.toMap(RosterEntry::getId, Function.identity()));
        List<DayMark> lines = book.marks().stream().filter(mark -> entries.containsKey(mark.getEntryId()))
            .sorted(Comparator.comparing(DayMark::getDay)
                .thenComparing(mark -> book.entries().indexOf(entries.get(mark.getEntryId()))))
            .toList();
        Target target = new Target(sheet, book.people(), zone);
        for (int index = 0; index < lines.size(); index++) {
            DayMark mark = lines.get(index);
            writeLine(target, index + 1, entries.get(mark.getEntryId()), mark);
        }
        sheet.freezePane(0, 1);
    }

    private static void writeLine(Target target, int row, RosterEntry entry, DayMark mark) {
        Worksheet sheet = target.sheet();
        sheet.value(row, 0, mark.getDay());
        sheet.style(row, 0).format("dd.mm.yyyy").set();
        sheet.value(row, 1, entry.getKind() == RosterKind.CREW ? "Ekip" : "Kişi");
        sheet.value(row, 2, target.people().nameOf(entry));
        text(sheet, row, 3, entry.getTrade());
        sheet.value(row, 4, SheetMarks.label(mark.getStatus()));
        sheet.style(row, 4).fillColor(SheetMarks.fill(mark.getStatus())).set();
        if (mark.getOvertimeHours() != null) {
            sheet.value(row, 5, mark.getOvertimeHours());
        }
        text(sheet, row, 6, mark.getNote());
        sheet.value(row, 7, target.people().nameOfUser(mark.getMarkedBy()));
        sheet.value(row, 8, TIME.format(mark.getMarkedAt().atZone(target.zone())));
    }

    /** Boş bilgi hücreye yazılmaz: hücre boş kalır. */
    private static void text(Worksheet sheet, int row, int column, String value) {
        if (value != null) {
            sheet.value(row, column, value);
        }
    }
}
