package com.atalay.santiye.material;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.material.dto.FieldShipmentRef;
import java.util.List;
import java.util.UUID;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Şantiyenin Saha akışındaki malzeme kartları. Gönderi yalnızca referanstır: kart sevkiyatın güncel durumunu buradan
 * okur, iptal edilen sevkiyatın kartı "İptal" der. Özet ilk kalemi ve kaç kalem daha olduğunu söyler.
 */
@Service
class FieldShipments {

    private static final String SELECT = """
        select f.post_id, s.id as shipment_id, s.number, s.type, s.status,
               (select m.name || ' ' || trim(trailing '.' from to_char(sl.quantity, 'FM999999990.999'))
                  || ' ' || m.unit
                  || case when (select count(*) from material_shipment_lines where shipment_id = s.id) > 1
                          then ', +' || ((select count(*) from material_shipment_lines where shipment_id = s.id) - 1)
                               || ' kalem'
                          else '' end
                from material_shipment_lines sl join materials m on m.id = sl.material_id
                where sl.shipment_id = s.id order by m.name limit 1) as summary
        from material_field_posts f join material_shipments s on s.id = f.shipment_id
        where f.site_id = :site and s.company_id = :company
        """;

    private final JdbcClient jdbc;

    FieldShipments(JdbcClient jdbc) {
        this.jdbc = jdbc;
    }

    @Transactional(readOnly = true)
    List<FieldShipmentRef> ofSite(CurrentUser user, UUID siteId) {
        return jdbc.sql(SELECT)
            .param("site", siteId)
            .param("company", user.companyId())
            .query(FieldShipmentRef.class)
            .list();
    }
}
