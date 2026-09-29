package com.atalay.santiye.production;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import org.dhatim.fastexcel.Worksheet;

/**
 * İmalat raporunun iki sayfasının ortak dili: koyu, lacivert başlık satırı (puantaj Excel'iyle aynı), sabit ilk satır
 * ve durumun Türkçe adı ile ekrandaki rengi (Devam ediyor mavi, Bitmeye yakın turuncu, Gecikiyor kırmızı,
 * Tamamlandı yeşil).
 */
final class ProductionSheets {

    private static final String HEADER_FILL = "1F3A8A";
    private static final Map<ProductionStatus, String> LABELS = Map.of(
        ProductionStatus.IN_PROGRESS, "Devam ediyor",
        ProductionStatus.NEARLY_DONE, "Bitmeye yakın",
        ProductionStatus.DELAYED, "Gecikiyor",
        ProductionStatus.COMPLETED, "Tamamlandı");
    private static final Map<ProductionStatus, String> FILLS = Map.of(
        ProductionStatus.IN_PROGRESS, "DBEAFE",
        ProductionStatus.NEARLY_DONE, "FFEDD5",
        ProductionStatus.DELAYED, "FEE2E2",
        ProductionStatus.COMPLETED, "DCFCE7");

    /** Sütunun başlığı ve Excel'deki genişliği. */
    record Column(String title, int width) {
    }

    /**
     * Bir satırın hücreleri. Boş bilgi yazılmaz, hücre boş kalır (Excel'de "boş" diye süzülür). Sayı ve tarih gerçek
     * sayı ve tarih olarak yazılır: Excel onları metin değil sayı ve tarih diye toplar, sıralar.
     */
    record Row(Worksheet sheet, int row) {

        void text(int column, String value) {
            if (value != null) {
                sheet.value(row, column, value);
            }
        }

        void number(int column, Number value) {
            if (value != null) {
                sheet.value(row, column, value);
            }
        }

        void quantity(int column, BigDecimal value) {
            number(column, value);
            format(column, "#,##0.###");
        }

        void percent(int column, double value) {
            number(column, value / 100);
            format(column, "0.0%");
        }

        void date(int column, LocalDate value) {
            if (value != null) {
                sheet.value(row, column, value);
                format(column, "dd.mm.yyyy");
            }
        }

        void dateTime(int column, LocalDateTime value) {
            if (value != null) {
                sheet.value(row, column, value);
                format(column, "dd.mm.yyyy hh:mm");
            }
        }

        void status(int column, ProductionStatus status) {
            sheet.value(row, column, LABELS.get(status));
            sheet.style(row, column).fillColor(FILLS.get(status)).set();
        }

        private void format(int column, String pattern) {
            sheet.style(row, column).format(pattern).set();
        }
    }

    private ProductionSheets() {
    }

    static void header(Worksheet sheet, List<Column> columns) {
        for (int index = 0; index < columns.size(); index++) {
            sheet.value(0, index, columns.get(index).title());
            sheet.width(index, columns.get(index).width());
        }
        sheet.range(0, 0, 0, columns.size() - 1).style().bold().fillColor(HEADER_FILL).fontColor("FFFFFF").set();
        sheet.freezePane(0, 1);
    }
}
