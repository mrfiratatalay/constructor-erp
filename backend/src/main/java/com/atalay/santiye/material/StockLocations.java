package com.atalay.santiye.material;

import static com.atalay.santiye.material.MaterialTexts.tidy;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.common.error.ApiException;
import com.atalay.santiye.material.dto.DepotRequest;
import com.atalay.santiye.material.dto.LocationView;
import java.time.Clock;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Stok lokasyonları: depolar ve şantiyeler. Firmanın hiç deposu yoksa ilk okumada "Ana Depo" açılır; her şantiye
 * kendiliğinden bir lokasyondur. Tamamlanmış şantiye listenin sonunda durur (geçmiş stoğu orada kalmış olabilir).
 */
@Service
public class StockLocations {

    private static final String DEFAULT_DEPOT = "Ana Depo";
    private static final String SELECT = """
        select l.id, l.kind, coalesce(l.name, s.name) as name, l.site_id, (s.id is null or s.status = 'ACTIVE') as active
        from stock_locations l left join sites s on s.id = l.site_id
        where l.company_id = :company
        order by active desc, l.kind, lower(coalesce(l.name, s.name))
        """;

    private final StockLocationRepository locations;
    private final JdbcClient jdbc;
    private final Clock clock;

    StockLocations(StockLocationRepository locations, JdbcClient jdbc, Clock clock) {
        this.locations = locations;
        this.jdbc = jdbc;
        this.clock = clock;
    }

    @Transactional
    public List<LocationView> list(CurrentUser user) {
        return listOf(user.companyId());
    }

    @Transactional
    public LocationView createDepot(CurrentUser user, DepotRequest request) {
        String name = tidy(request.name());
        if (locations.depotNameTaken(user.companyId(), name)) {
            throw ApiException.conflict("Bu adla bir depo zaten var.");
        }
        StockLocation depot = locations.saveAndFlush(StockLocation.depot(user.companyId(), name, clock.instant()));
        return byId(user.companyId()).get(depot.getId());
    }

    /** Lokasyonlar kimliklerine göre: hareket ve stok görünümleri adları buradan alır. */
    @Transactional
    public Map<UUID, LocationView> byId(UUID companyId) {
        return listOf(companyId).stream().collect(Collectors.toMap(LocationView::id, Function.identity()));
    }

    StockLocation require(UUID companyId, UUID locationId) {
        return locations.findByIdAndCompanyId(locationId, companyId)
            .orElseThrow(() -> ApiException.notFound("Lokasyon bulunamadı."));
    }

    private List<LocationView> listOf(UUID companyId) {
        if (!locations.existsByCompanyIdAndKind(companyId, LocationKind.DEPOT)) {
            locations.save(StockLocation.depot(companyId, DEFAULT_DEPOT, clock.instant()));
        }
        locations.addMissingSites(companyId);
        locations.flush();
        return jdbc.sql(SELECT)
            .param("company", companyId)
            .query(LocationView.class)
            .list();
    }
}
