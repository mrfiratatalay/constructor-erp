package com.atalay.santiye.material;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.material.dto.ShipmentLineView;
import com.atalay.santiye.material.dto.ShipmentRow;
import jakarta.annotation.Nullable;
import java.math.BigDecimal;
import java.time.Clock;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Sevkiyat listesi: WhatsApp'ın sohbet listesi gibi tek liste, en yeniden eskiye. Tür çipleri ile lokasyon, tarih
 * ve durum süzgeçleri kalktı; geriye yalnızca arama kaldı. Kalemler tek sorguda toplanır (N+1 yok).
 */
@Service
class ShipmentRows {

    /** Sevkiyatın bir ucunun adı: depo kendi adıyla, şantiye şantiyenin adıyla, dışarısı firmanın adıyla. */
    private static final String SELECT = """
        select s.id, s.number, s.type, s.status, s.day, s.expects_return,
               (s.expects_return and not exists (select 1 from material_shipments r
                    where r.return_of_id = s.id and r.status <> 'CANCELLED')) as awaiting_return,
               coalesce(fl.name, fsite.name, case when s.source_id is null then p.name end) as from_name,
               coalesce(tl.name, tsite.name, case when s.destination_id is null then p.name end) as to_name
        from material_shipments s
        left join stock_locations fl on fl.id = s.source_id
        left join sites fsite on fsite.id = fl.site_id
        left join stock_locations tl on tl.id = s.destination_id
        left join sites tsite on tsite.id = tl.site_id
        left join material_parties p on p.id = s.party_id
        where s.company_id = :company
          and (cast(:one as uuid) is null or s.id = cast(:one as uuid))
          and (cast(:search as text) is null
               or lower(coalesce(s.description, '')) like cast(:search as text)
               or lower(coalesce(p.name, '')) like cast(:search as text)
               or exists (select 1 from material_shipment_lines sl join materials m on m.id = sl.material_id
                          where sl.shipment_id = s.id and lower(m.name) like cast(:search as text)))
        order by s.day desc, s.number desc
        limit 200
        """;

    private static final String LINES = """
        select sl.shipment_id, sl.material_id, m.name as material_name, sl.quantity, m.unit
        from material_shipment_lines sl join materials m on m.id = sl.material_id
        where sl.shipment_id in (:shipments)
        """;

    private final JdbcClient jdbc;
    private final Clock clock;

    ShipmentRows(JdbcClient jdbc, Clock clock) {
        this.jdbc = jdbc;
        this.clock = clock;
    }

    @Transactional(readOnly = true)
    List<ShipmentRow> list(CurrentUser user, @Nullable String search) {
        return query(user.companyId(), null, search);
    }

    @Transactional(readOnly = true)
    ShipmentRow one(UUID companyId, UUID shipmentId) {
        return query(companyId, shipmentId, null).getFirst();
    }

    private List<ShipmentRow> query(UUID companyId, @Nullable UUID one, @Nullable String search) {
        List<Header> headers = jdbc.sql(SELECT)
            .param("company", companyId)
            .param("one", one)
            .param("search", search == null || search.isBlank() ? null : "%" + search.strip().toLowerCase() + "%")
            .query(Header.class)
            .list();
        Map<UUID, List<ShipmentLineView>> lines = linesOf(headers);
        LocalDate today = LocalDate.now(clock);
        return headers.stream().map(header -> header.row(lines.getOrDefault(header.id(), List.of()), today)).toList();
    }

    private Map<UUID, List<ShipmentLineView>> linesOf(List<Header> headers) {
        if (headers.isEmpty()) {
            return Map.of();
        }
        return jdbc.sql(LINES).param("shipments", headers.stream().map(Header::id).toList())
            .query(Line.class).list().stream()
            .collect(Collectors.groupingBy(Line::shipmentId, Collectors.mapping(Line::view, Collectors.toList())));
    }

    /** Listenin bir satırı, kalemleri eklenmeden önce. */
    private record Header(UUID id, long number, ShipmentType type, ShipmentStatus status, LocalDate day,
        boolean expectsReturn, boolean awaitingReturn, String fromName, String toName) {

        ShipmentRow row(List<ShipmentLineView> lines, LocalDate today) {
            return new ShipmentRow(id, number, type, status, fromName, toName, day, expectsReturn, waiting(),
                daysOut(today), lines);
        }

        /** Hâlâ dışarıda: geri gelmesi bekleniyor, iadesi henüz kaydedilmemiş ve iptal edilmemiş. */
        private boolean waiting() {
            return awaitingReturn && status != ShipmentStatus.CANCELLED;
        }

        /** "40 gündür dönmedi": yalnızca hâlâ dışarıda olanlarda. */
        private Integer daysOut(LocalDate today) {
            return waiting() ? (int) ChronoUnit.DAYS.between(day, today) : null;
        }
    }

    private record Line(UUID shipmentId, UUID materialId, String materialName, BigDecimal quantity, String unit) {

        ShipmentLineView view() {
            return new ShipmentLineView(materialId, materialName, quantity, unit);
        }
    }
}
