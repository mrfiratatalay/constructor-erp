package com.atalay.santiye.material;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.material.dto.CancelRequest;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Sevkiyata sonradan yapılan tek şey: iptal. Kayıt silinmez; nedeni zorunludur ve geçmişte durur, çünkü defter
 * iz bırakmadan değişmez.
 */
@Service
public class ShipmentActions {

    private final Shipments shipments;
    private final ShipmentHistory history;

    ShipmentActions(Shipments shipments, ShipmentHistory history) {
        this.shipments = shipments;
        this.history = history;
    }

    @Transactional
    public void cancel(CurrentUser user, UUID shipmentId, CancelRequest request) {
        Shipment shipment = shipments.require(user, shipmentId);
        if (shipment.getStatus() == ShipmentStatus.CANCELLED) {
            return;
        }
        shipment.cancel();
        history.record(shipmentId, ShipmentEventKind.CANCELLED, user, MaterialTexts.tidy(request.reason()));
    }
}
