package com.atalay.santiye.production;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.production.ProductionSheets.Column;
import com.atalay.santiye.production.ProductionSheets.Row;
import com.atalay.santiye.production.dto.ProductionEntryView;
import com.atalay.santiye.production.dto.ProductionItemView;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.dhatim.fastexcel.Workbook;
import org.dhatim.fastexcel.Worksheet;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Şantiyenin imalat raporu (Excel), ekrandakiyle aynı hesaplardan: "İmalatlar" (her iş kalemi, ilerlemesi ve
 * durumu) ve "Günlük girişler" (gün gün bütün girişler, notlar ve girenler; Excel'de süzülür, sıralanır).
 */
@Service
public class ProductionExport {

    private static final List<Column> ITEM_COLUMNS = List.of(new Column("Tür", 16), new Column("İmalat", 26),
        new Column("Taşeron", 20), new Column("Toplam", 11), new Column("Birim", 8), new Column("Gerçekleşen", 12),
        new Column("Kalan", 11), new Column("İlerleme", 10), new Column("Bugün", 9), new Column("Durum", 14),
        new Column("Başlangıç", 12), new Column("Planlanan bitiş", 15), new Column("Son güncelleme", 17),
        new Column("Not", 36));
    private static final List<Column> ENTRY_COLUMNS = List.of(new Column("Tarih", 12), new Column("İmalat", 26),
        new Column("Taşeron", 20), new Column("Miktar", 11), new Column("Birim", 8), new Column("Çalışan", 9),
        new Column("Not", 40), new Column("Dosya", 7), new Column("Saha'da", 8), new Column("Giren", 18),
        new Column("Girildiği an", 17));

    private final ProductionReads reads;
    private final Clock clock;

    ProductionExport(ProductionReads reads, Clock clock) {
        this.reads = reads;
        this.clock = clock;
    }

    @Transactional(readOnly = true)
    public byte[] site(CurrentUser user, UUID siteId) {
        List<ProductionItemView> items = reads.board(user, siteId).items();
        List<ProductionEntryView> entries = reads.allEntries(siteId);
        ByteArrayOutputStream file = new ByteArrayOutputStream();
        try (Workbook workbook = new Workbook(file, "Kizilkan Santiye", "1.0")) {
            writeItems(workbook.newWorksheet("İmalatlar"), items);
            writeEntries(workbook.newWorksheet("Günlük girişler"), entries, items);
        } catch (IOException problem) {
            throw new UncheckedIOException(problem);
        }
        return file.toByteArray();
    }

    private void writeItems(Worksheet sheet, List<ProductionItemView> items) {
        ProductionSheets.header(sheet, ITEM_COLUMNS);
        for (int index = 0; index < items.size(); index++) {
            writeItem(sheet, index + 1, items.get(index));
        }
    }

    private void writeItem(Worksheet sheet, int row, ProductionItemView item) {
        var cells = new Row(sheet, row);
        cells.text(0, item.trade());
        cells.text(1, item.name());
        cells.text(2, item.crew() == null ? null : item.crew().name());
        cells.quantity(3, item.totalQuantity());
        cells.text(4, item.unit());
        cells.quantity(5, item.doneQuantity());
        cells.quantity(6, item.remainingQuantity());
        cells.percent(7, item.percent());
        cells.quantity(8, item.todayQuantity());
        cells.status(9, item.status());
        cells.date(10, item.startDate());
        cells.date(11, item.plannedEnd());
        cells.dateTime(12, local(item.lastEntryAt()));
        cells.text(13, item.note());
    }

    private void writeEntries(Worksheet sheet, List<ProductionEntryView> entries, List<ProductionItemView> items) {
        ProductionSheets.header(sheet, ENTRY_COLUMNS);
        Map<UUID, ProductionItemView> byId = items.stream()
            .collect(Collectors.toMap(ProductionItemView::id, Function.identity()));
        for (int index = 0; index < entries.size(); index++) {
            ProductionEntryView entry = entries.get(index);
            writeEntry(sheet, index + 1, entry, byId.get(entry.itemId()));
        }
    }

    private void writeEntry(Worksheet sheet, int row, ProductionEntryView entry, ProductionItemView item) {
        var cells = new Row(sheet, row);
        cells.date(0, entry.day());
        cells.text(1, item.name());
        cells.text(2, item.crew() == null ? null : item.crew().name());
        cells.quantity(3, entry.quantity());
        cells.text(4, item.unit());
        cells.number(5, entry.workerCount());
        cells.text(6, entry.note());
        cells.number(7, entry.media().isEmpty() ? null : entry.media().size());
        cells.text(8, entry.onField() ? "Evet" : "Hayır");
        cells.text(9, entry.authorName());
        cells.dateTime(10, local(entry.createdAt()));
    }

    /** Excel saat dilimi bilmez: an firmanın saatine çevrilip yazılır. */
    private LocalDateTime local(Instant at) {
        return at == null ? null : LocalDateTime.ofInstant(at, clock.getZone());
    }
}
