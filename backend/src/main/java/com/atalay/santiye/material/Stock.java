package com.atalay.santiye.material;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.material.dto.StockLevel;
import java.util.List;
import java.util.UUID;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Bir yerdeki kalan malzeme: teslim alınmış girişler eksi çıkışlar. Stok bir kolon değildir, sevkiyatlardan
 * hesaplanır; ayrı bir stok ekranı da yoktur. Bu sayı yalnızca sevkiyat çıkarılırken malzemenin altında görünür
 * ("Depoda: 300 Torba"), çünkü depo sorumlusunun onu merak ettiği tek an gönderirken olan andır.
 *
 * <p>Yoldaki mal kaynaktan düşmüştür ama hedefe girmemiştir: kamyondaki çimento ne depodadır ne şantiyede.
 */
@Service
public class Stock {

    private static final String LEVELS = """
        select l.material_id, sum(l.quantity * m.direction) as quantity
        from material_shipment_lines l
        join (
            select id, -1 as direction from material_shipments
                where company_id = :company and status <> 'CANCELLED' and source_id = :place
            union all
            select id, 1 as direction from material_shipments
                where company_id = :company and status <> 'CANCELLED' and destination_id = :place
        ) m on m.id = l.shipment_id
        group by l.material_id having sum(l.quantity * m.direction) <> 0
        """;

    private final JdbcClient jdbc;

    Stock(JdbcClient jdbc) {
        this.jdbc = jdbc;
    }

    @Transactional(readOnly = true)
    public List<StockLevel> at(CurrentUser user, UUID placeId) {
        return jdbc.sql(LEVELS)
            .param("company", user.companyId())
            .param("place", placeId)
            .query(StockLevel.class)
            .list();
    }
}
