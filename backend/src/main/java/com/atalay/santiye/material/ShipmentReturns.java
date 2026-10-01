package com.atalay.santiye.material;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.common.error.ApiException;
import java.time.Clock;
import java.time.LocalDate;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Dışarıdaki malzemenin geri gelişi. Boş bir formdan girilseydi yanlış firmaya ya da yanlış malzemeye bağlanırdı;
 * bu yüzden iade her zaman çıkışın kendisinden başlar: malzeme, firma ve dönüş yeri oradan gelir. İade kaydı
 * düşünce çıkış artık "dışarıda" sayılmaz.
 */
@Service
public class ShipmentReturns {

    private final ShipmentRepository shipments;
    private final ShipmentLineRepository lines;
    private final ShipmentHistory history;
    private final Clock clock;

    ShipmentReturns(ShipmentRepository shipments, ShipmentLineRepository lines, ShipmentHistory history, Clock clock) {
        this.shipments = shipments;
        this.lines = lines;
        this.history = history;
        this.clock = clock;
    }

    @Transactional
    public UUID receive(CurrentUser user, UUID shipmentId) {
        Shipment out = shipments.findLockedByIdAndCompanyId(shipmentId, user.companyId())
            .orElseThrow(() -> ApiException.notFound("Sevkiyat bulunamadı."));
        requireReturnable(out);
        var existing = shipments.findFirstByReturnOfIdAndCompanyIdAndStatusNot(shipmentId, user.companyId(),
            ShipmentStatus.CANCELLED);
        if (existing.isPresent()) {
            return existing.get().getId();
        }
        Shipment back = shipments.saveAndFlush(reverseOf(user, out));
        lines.findByShipmentId(out.getId())
            .forEach(line -> lines.save(new ShipmentLine(back.getId(), line.getMaterialId(), line.getQuantity())));
        history.record(back.getId(), ShipmentEventKind.CREATED, user, null);
        history.record(out.getId(), ShipmentEventKind.RETURN_ADDED, user, null);
        return back.getId();
    }

    /** İade, malzemenin çıktığı yere döner; kalemleri çıkıştan birebir kopyalanır. */
    private Shipment reverseOf(CurrentUser user, Shipment out) {
        var route = new ShipmentRoute(ShipmentType.RETURN, null, out.getSourceId(), out.getPartyId());
        Shipment shipment = new Shipment(UUID.randomUUID(), user.companyId(), route, user.userId(), clock.instant());
        shipment.describe(LocalDate.now(clock), null, false, out.getId());
        return shipment;
    }

    private static void requireReturnable(Shipment out) {
        if (out.getType() != ShipmentType.OUTBOUND || !out.expectsReturn()) {
            throw ApiException.badRequest("Bu sevkiyatta geri gelecek malzeme yok.");
        }
        if (out.getStatus() == ShipmentStatus.CANCELLED) {
            throw ApiException.badRequest("İptal edilmiş sevkiyatın iadesi olmaz.");
        }
        if (out.getSourceId() == null) {
            throw ApiException.badRequest("Malzemenin döneceği depo belli değil.");
        }
    }
}
