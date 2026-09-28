package com.atalay.santiye.puantaj;

import com.atalay.santiye.auth.CurrentUser;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.time.Clock;
import java.time.YearMonth;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import org.dhatim.fastexcel.Workbook;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Ayın Excel dökümü, ekrandaki cetvelle aynı defterden: "Personel" (kişi × gün, mesaiyle), "Ekipler" (ekip × gün)
 * ve "Kayıtlar" (gün gün tam liste, notlarla). Yevmiye "Çalıştığı gün" sütununa göre hesaplanır.
 */
@Service
public class PuantajExport {

    private static final GridSheet.Layout PEOPLE = new GridSheet.Layout("Personel", List.of("Ad Soyad", "Görev"),
        List.of("Çalıştığı gün", "Yarım gün", "Gelmedi", "İzinli", "Mesai (saat)"));
    private static final GridSheet.Layout CREWS = new GridSheet.Layout("Taşeron ekipler",
        List.of("Ekip başı", "İş kolu"), List.of("Geldiği gün", "Gelmediği gün"));

    private final LedgerReader ledger;
    private final Clock clock;

    PuantajExport(LedgerReader ledger, Clock clock) {
        this.ledger = ledger;
        this.clock = clock;
    }

    @Transactional
    public byte[] month(CurrentUser user, YearMonth month) {
        Ledger book = ledger.read(user.companyId(), month.atDay(1), month.atEndOfMonth());
        ByteArrayOutputStream file = new ByteArrayOutputStream();
        try (Workbook workbook = new Workbook(file, "Kizilkan Santiye", "1.0")) {
            GridSheet.write(workbook.newWorksheet("Personel"), month, PEOPLE, rowsOf(book, RosterKind.PERSON));
            GridSheet.write(workbook.newWorksheet("Ekipler"), month, CREWS, rowsOf(book, RosterKind.CREW));
            RecordsSheet.write(workbook.newWorksheet("Kayıtlar"), book, clock.getZone());
        } catch (IOException problem) {
            throw new UncheckedIOException(problem);
        }
        return file.toByteArray();
    }

    private static List<GridSheet.Row> rowsOf(Ledger book, RosterKind kind) {
        Map<UUID, List<DayMark>> byEntry = book.marks().stream()
            .collect(Collectors.groupingBy(DayMark::getEntryId));
        return book.entries().stream().filter(entry -> entry.getKind() == kind).map(entry -> {
            List<DayMark> marks = byEntry.getOrDefault(entry.getId(), List.of());
            return new GridSheet.Row(book.people().nameOf(entry), entry.getTrade(), marks, totalsOf(kind, marks));
        }).toList();
    }

    private static List<Number> totalsOf(RosterKind kind, List<DayMark> marks) {
        MonthTotals totals = MonthTotals.of(marks);
        if (kind == RosterKind.CREW) {
            return List.of(totals.workedDays(), totals.absentDays());
        }
        return List.of(totals.workedDays(), totals.halfDays(), totals.absentDays(), totals.leaveDays(),
            totals.overtime());
    }
}
