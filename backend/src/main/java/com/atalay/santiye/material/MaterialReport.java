package com.atalay.santiye.material;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.material.dto.MovementFilter;
import com.atalay.santiye.material.dto.ReturnRow;
import com.atalay.santiye.material.dto.StockCell;
import com.atalay.santiye.material.dto.StockRow;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.time.Clock;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import org.dhatim.fastexcel.Workbook;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Malzeme raporu, tek çalışma kitabı; sunucuda oluşturulur (büyük döküm tarayıcıyı yormaz). Sayfalar seçilir:
 * Hareketler (ekrandaki süzgeçlerle), Stok Özeti (bugünün durumu, lokasyon sütunlarıyla) ve Beklenen İadeler.
 */
@Service
public class MaterialReport {

    private final MovementSearch search;
    private final StockView stock;
    private final MaterialInsights insights;
    private final Clock clock;

    MaterialReport(MovementSearch search, StockView stock, MaterialInsights insights, Clock clock) {
        this.search = search;
        this.stock = stock;
        this.insights = insights;
        this.clock = clock;
    }

    @Transactional
    public byte[] workbook(CurrentUser user, MovementFilter filter, Set<ReportSheet> sheets) {
        ByteArrayOutputStream file = new ByteArrayOutputStream();
        try (Workbook workbook = new Workbook(file, "Kizilkan Santiye", "1.0")) {
            if (sheets.contains(ReportSheet.MOVEMENTS)) {
                TableSheet.write(workbook.newWorksheet("Hareketler"), ReportRows.MOVEMENT_COLUMNS,
                    search.all(user, filter).stream().map(ReportRows::movement).toList(), clock.getZone());
            }
            if (sheets.contains(ReportSheet.STOCK)) {
                writeStock(workbook, user, filter);
            }
            if (sheets.contains(ReportSheet.RETURNS)) {
                writeReturns(workbook, user, filter);
            }
        } catch (IOException problem) {
            throw new UncheckedIOException(problem);
        }
        return file.toByteArray();
    }

    /** Dosya adı dönemi söyler: malzeme_raporu_2026-09-01_2026-09-30.xlsx; dönem yoksa bugünün tarihi. */
    public String fileName(MovementFilter filter) {
        LocalDate today = LocalDate.now(clock);
        if (filter.from() == null && filter.to() == null) {
            return "malzeme_raporu_" + today + ".xlsx";
        }
        return "malzeme_raporu_" + (filter.from() == null ? "baslangic" : filter.from()) + "_"
            + (filter.to() == null ? today : filter.to()) + ".xlsx";
    }

    private void writeStock(Workbook workbook, CurrentUser user, MovementFilter filter) {
        List<StockRow> rows = stock.rows(user).stream().filter(row -> ReportRows.stockMatches(row,
            filter.materialId(), MaterialTexts.tidy(filter.category()), filter.locationId())).toList();
        List<String> places = rows.stream().flatMap(row -> row.locations().stream()).map(StockCell::name)
            .distinct().toList();
        TableSheet.write(workbook.newWorksheet("Stok Özeti"), ReportRows.stockColumns(places),
            rows.stream().map(row -> ReportRows.stock(row, places)).toList(), clock.getZone());
    }

    private void writeReturns(Workbook workbook, CurrentUser user, MovementFilter filter) {
        LocalDate today = LocalDate.now(clock);
        List<ReturnRow> rows = insights.awaitingReturns(user).stream()
            .filter(row -> filter.materialId() == null || row.materialId().equals(filter.materialId()))
            .toList();
        TableSheet.write(workbook.newWorksheet("Beklenen İadeler"), ReportRows.RETURN_COLUMNS,
            rows.stream().map(row -> ReportRows.awaitingReturn(row, today)).toList(), clock.getZone());
    }
}
