package com.atalay.santiye.material;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.material.dto.HistoryEntry;
import java.time.Clock;
import java.util.List;
import java.util.UUID;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Component;

/** Sevkiyatın değişmez geçmişi: kim oluşturdu, kim teslim aldı, kim iptal etti. Yazılır, hiç silinmez. */
@Component
class ShipmentHistory {

    private static final String SELECT = """
        select e.shipment_id, e.kind, u.full_name as actor_name, e.note, e.created_at as at
        from material_shipment_events e join users u on u.id = e.actor_id
        where e.shipment_id in (:shipments) order by e.created_at
        """;

    private final ShipmentEventRepository events;
    private final JdbcClient jdbc;
    private final Clock clock;

    ShipmentHistory(ShipmentEventRepository events, JdbcClient jdbc, Clock clock) {
        this.events = events;
        this.jdbc = jdbc;
        this.clock = clock;
    }

    void record(UUID shipmentId, ShipmentEventKind kind, CurrentUser user, String note) {
        events.save(new ShipmentEvent(shipmentId, kind, user.userId(), note, clock.instant()));
    }

    List<HistoryEntry> of(UUID shipmentId) {
        return jdbc.sql(SELECT).param("shipments", List.of(shipmentId)).query(HistoryEntry.class).list();
    }
}
