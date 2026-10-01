package com.atalay.santiye.material;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.common.error.ApiException;
import com.atalay.santiye.material.dto.CancelRequest;
import com.atalay.santiye.material.dto.ShipmentEditRequest;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Hareketin tarih ve açıklaması düzeltilebilir; miktarı ve rotası değişmez. İptal ve düzeltme geçmişte kalır.
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
        Shipment shipment = shipments.requireForChange(user, shipmentId);
        if (shipment.getStatus() == ShipmentStatus.CANCELLED) {
            return;
        }
        shipment.cancel();
        history.record(shipmentId, ShipmentEventKind.CANCELLED, user, MaterialTexts.tidy(request.reason()));
    }

    @Transactional
    public void edit(CurrentUser user, UUID shipmentId, ShipmentEditRequest request) {
        Shipment shipment = shipments.requireForChange(user, shipmentId);
        if (shipment.getStatus() == ShipmentStatus.CANCELLED) {
            throw ApiException.conflict("İptal edilmiş hareket düzenlenemez.");
        }
        String description = MaterialTexts.tidy(request.description());
        if (shipment.hasDetails(request.day(), description)) {
            return;
        }
        String note = ShipmentEditNotes.of(shipment, new ShipmentEditRequest(request.day(), description));
        shipment.edit(request.day(), description);
        history.record(shipmentId, ShipmentEventKind.EDITED, user, note);
    }
}
