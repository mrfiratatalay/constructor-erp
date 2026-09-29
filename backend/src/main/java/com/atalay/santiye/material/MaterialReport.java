package com.atalay.santiye.material;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.material.dto.ShipmentLineView;
import com.atalay.santiye.material.dto.ShipmentRow;
import jakarta.annotation.Nullable;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.time.Clock;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import org.dhatim.fastexcel.Workbook;
import org.springframework.stereotype.Service;

/**
 * Sevkiyat dökümü: ekrandaki listenin Excel hali, her kalem bir satır. Tek sayfadır; stok özeti yoktur, çünkü
 * modül stok tutmaz.
 */
@Service
class MaterialReport {

    private static final List<TableSheet.Column> COLUMNS = List.of(
        new TableSheet.Column("Tarih", 12),
        new TableSheet.Column("Sevkiyat", 14),
        new TableSheet.Column("Ne oldu", 22),
        new TableSheet.Column("Nereden", 26),
        new TableSheet.Column("Nereye", 26),
        new TableSheet.Column("Malzeme", 28),
        new TableSheet.Column("Miktar", 12),
        new TableSheet.Column("Birim", 10),
        new TableSheet.Column("Durum", 16));

    private final ShipmentRows rows;
    private final Clock clock;

    MaterialReport(ShipmentRows rows, Clock clock) {
        this.rows = rows;
        this.clock = clock;
    }

    byte[] workbook(CurrentUser user, @Nullable String search) {
        var out = new ByteArrayOutputStream();
        try (Workbook workbook = new Workbook(out, "Constructor ERP", "1.0")) {
            TableSheet.write(workbook.newWorksheet("Sevkiyatlar"), COLUMNS, linesOf(rows.list(user, search)),
                clock.getZone());
        } catch (IOException problem) {
            throw new UncheckedIOException(problem);
        }
        return out.toByteArray();
    }

    String fileName() {
        return "sevkiyatlar_" + LocalDate.now(clock) + ".xlsx";
    }

    /** Bir sevkiyatın her kalemi ayrı satır olur: Excel'de süzülsün ve toplansın diye. */
    private static List<List<Object>> linesOf(List<ShipmentRow> shipments) {
        List<List<Object>> lines = new ArrayList<>();
        shipments.forEach(shipment -> shipment.lines()
            .forEach(line -> lines.add(rowOf(shipment, line))));
        return lines;
    }

    private static List<Object> rowOf(ShipmentRow shipment, ShipmentLineView line) {
        return List.of(shipment.day(), Quantities.number(shipment.number()),
            ShipmentLabels.typeOf(shipment.type()), text(shipment.fromName()), text(shipment.toName()),
            line.materialName(), line.quantity(), line.unit(), ShipmentLabels.statusOf(shipment.status()));
    }

    private static String text(@Nullable String value) {
        return value == null ? "—" : value;
    }
}
