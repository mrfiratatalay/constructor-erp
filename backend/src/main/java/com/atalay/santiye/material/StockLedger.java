package com.atalay.santiye.material;

import com.atalay.santiye.common.error.ApiException;
import java.math.BigDecimal;
import java.util.UUID;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Component;

/**
 * Bir malzemenin bir lokasyondaki kullanılabilir stoğu, hareketlerden: hedefe teslim edilmiş girişler eksi kaynaktan
 * yapılmış çıkışlar. Yoldaki ve kontrol bekleyen hareket kaynaktan düşer ama hedefe henüz girmez; iptal edilen hiçbir
 * yere dokunmaz. Çağıran malzemenin satırını kilitlemiş olmalıdır (MaterialRepository.lockByIdAndCompanyId).
 */
@Component
class StockLedger {

    private static final String BALANCE = """
        select coalesce(sum(case when destination_id = :location then quantity else -quantity end), 0)
        from material_movements
        where material_id = :material and status <> 'CANCELLED'
          and (source_id = :location
               or (destination_id = :location and status not in ('IN_TRANSIT', 'PENDING_CHECK')))
        """;
    private static final String LOCATION_NAME = """
        select coalesce(l.name, s.name) from stock_locations l left join sites s on s.id = l.site_id where l.id = :id
        """;

    private final JdbcClient jdbc;

    StockLedger(JdbcClient jdbc) {
        this.jdbc = jdbc;
    }

    BigDecimal balance(UUID materialId, UUID locationId) {
        return jdbc.sql(BALANCE)
            .param("material", materialId)
            .param("location", locationId)
            .query(BigDecimal.class)
            .single();
    }

    /** Normal akışta stok eksiye düşmez: kullanılabilirden fazlası çıkamaz. */
    void requireAvailable(Material material, UUID locationId, BigDecimal quantity) {
        BigDecimal available = balance(material.getId(), locationId);
        if (available.compareTo(quantity) >= 0) {
            return;
        }
        throw ApiException.conflict("Stok yetmiyor. %s · %s: kullanılabilir %s, istenen %s.".formatted(
            locationName(locationId), material.getName(), Quantities.withUnit(available.max(BigDecimal.ZERO),
                material.getUnit()), Quantities.withUnit(quantity, material.getUnit())));
    }

    String locationName(UUID locationId) {
        return jdbc.sql(LOCATION_NAME).param("id", locationId).query(String.class).single();
    }
}
