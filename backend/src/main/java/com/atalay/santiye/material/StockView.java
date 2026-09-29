package com.atalay.santiye.material;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.material.dto.LocationView;
import com.atalay.santiye.material.dto.MaterialView;
import com.atalay.santiye.material.dto.StockCell;
import com.atalay.santiye.material.dto.StockRow;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Stok sekmesi: "Bu malzeme şu an nerede?" sorusunun cevabı. Hareket geçmişi değil, hareketlerin bugünkü sonucu:
 * her malzemenin lokasyon lokasyon kullanılabilir miktarı, yoldaki, kontrol bekleyen ve dışarıdaki (ödünç) miktar.
 * Pasif malzeme yalnızca bir yerde stoğu kaldıysa görünür.
 */
@Service
public class StockView {

    private static final String BALANCES = """
        select material_id, location_id, sum(delta) as quantity from (
          select material_id, destination_id as location_id, quantity as delta from material_movements
          where company_id = :company and destination_id is not null
            and status not in ('CANCELLED', 'IN_TRANSIT', 'PENDING_CHECK')
          union all
          select material_id, source_id, -quantity from material_movements
          where company_id = :company and source_id is not null and status <> 'CANCELLED'
        ) ledger group by material_id, location_id having sum(delta) <> 0
        """;
    private static final String EXTRAS = """
        select mv.material_id,
          coalesce(sum(mv.quantity) filter (where mv.status = 'IN_TRANSIT'), 0) as in_transit,
          coalesce(sum(mv.quantity) filter (where mv.status = 'PENDING_CHECK'), 0) as pending_check,
          coalesce(sum(mv.quantity - coalesce(r.returned, 0))
            filter (where mv.type = 'OUTBOUND' and mv.purpose = 'LOANED'), 0) as outside,
          max(mv.day) as last_day
        from material_movements mv
        left join (select return_of_id, sum(quantity) as returned from material_movements
                   where type = 'RETURN' and status <> 'CANCELLED' group by return_of_id) r on r.return_of_id = mv.id
        where mv.company_id = :company and mv.status <> 'CANCELLED'
        group by mv.material_id
        """;

    private record Balance(UUID materialId, UUID locationId, BigDecimal quantity) {
    }

    private final MaterialCatalog catalog;
    private final StockLocations locations;
    private final JdbcClient jdbc;

    StockView(MaterialCatalog catalog, StockLocations locations, JdbcClient jdbc) {
        this.catalog = catalog;
        this.locations = locations;
        this.jdbc = jdbc;
    }

    @Transactional
    public List<StockRow> rows(CurrentUser user) {
        List<LocationView> places = locations.list(user);
        Map<UUID, List<StockCell>> cells = cellsByMaterial(user.companyId(), places);
        Map<UUID, StockExtras> extras = jdbc.sql(EXTRAS).param("company", user.companyId())
            .query(StockExtras.class).list().stream()
            .collect(Collectors.toMap(StockExtras::materialId, Function.identity()));
        return catalog.list(user).stream()
            .map(material -> StockRows.of(material, cells.getOrDefault(material.id(), List.of()),
                extras.getOrDefault(material.id(), StockExtras.none(material.id()))))
            .filter(row -> row.active() || row.available().signum() != 0)
            .toList();
    }

    @Transactional
    public StockRow row(CurrentUser user, MaterialView material) {
        return rows(user).stream().filter(row -> row.materialId().equals(material.id())).findFirst()
            .orElseGet(() -> StockRows.of(material, List.of(), StockExtras.none(material.id())));
    }

    /** Lokasyonların sırası listedekiyle aynı: önce depolar, sonra şantiyeler. */
    private Map<UUID, List<StockCell>> cellsByMaterial(UUID companyId, List<LocationView> places) {
        Map<UUID, List<Balance>> balances = jdbc.sql(BALANCES).param("company", companyId).query(Balance.class)
            .list().stream().collect(Collectors.groupingBy(Balance::materialId));
        Map<UUID, List<StockCell>> cells = new HashMap<>();
        balances.forEach((materialId, rows) -> {
            Map<UUID, BigDecimal> byLocation = rows.stream()
                .collect(Collectors.toMap(Balance::locationId, Balance::quantity));
            List<StockCell> ordered = new ArrayList<>();
            places.stream().filter(place -> byLocation.containsKey(place.id())).forEach(place -> ordered.add(
                new StockCell(place.id(), place.name(), place.kind(), byLocation.get(place.id()))));
            cells.put(materialId, ordered);
        });
        return cells;
    }
}
