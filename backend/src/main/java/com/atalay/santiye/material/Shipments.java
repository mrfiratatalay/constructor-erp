package com.atalay.santiye.material;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.common.error.ApiException;
import com.atalay.santiye.material.dto.ShipmentLineRequest;
import com.atalay.santiye.material.dto.ShipmentRequest;
import java.time.Clock;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Sevkiyat çıkarmak: bir kamyon, bir irsaliye, içinde birden çok kalem. Kullanıcı türü seçmez, yalnızca iki ucu
 * söyler; adını ShipmentRoute koyar. Yeni sevkiyat her zaman "yolda" başlar, hedefe teslim alınınca girer.
 */
@Service
public class Shipments {

    private final ShipmentRepository shipments;
    private final ShipmentLineRepository lines;
    private final StockLocations locations;
    private final MaterialParties parties;
    private final MaterialRepository materials;
    private final ShipmentHistory history;
    private final FieldReflection field;
    private final Clock clock;

    Shipments(ShipmentRepository shipments, ShipmentLineRepository lines, StockLocations locations,
        MaterialParties parties, MaterialRepository materials, ShipmentHistory history, FieldReflection field,
        Clock clock) {
        this.shipments = shipments;
        this.lines = lines;
        this.locations = locations;
        this.parties = parties;
        this.materials = materials;
        this.history = history;
        this.field = field;
        this.clock = clock;
    }

    /** Aynı istek iki kez gelirse (kopan bağlantı, iki kez basılan düğme) ikinci kayıt açılmaz. */
    @Transactional
    public UUID create(CurrentUser user, ShipmentRequest request) {
        if (shipments.findByIdAndCompanyId(request.id(), user.companyId()).isPresent()) {
            return request.id();
        }
        Shipment shipment = shipments.saveAndFlush(headerOf(user, request));
        request.lines().forEach(line -> lines.save(lineOf(user, shipment, line)));
        history.record(shipment.getId(), ShipmentEventKind.CREATED, user, null);
        field.reflect(user, shipment);
        return shipment.getId();
    }

    private Shipment headerOf(CurrentUser user, ShipmentRequest request) {
        UUID partyId = parties.resolve(user.companyId(), request.partyId(), request.partyName());
        ShipmentRoute route = ShipmentRoute.of(placeOf(user, request.sourceId()), placeOf(user, request.destinationId()),
            partyId, request.returnOfId() != null);
        Shipment shipment = new Shipment(request.id(), user.companyId(), route, user.userId(), clock.instant());
        LocalDate day = request.day() == null ? LocalDate.now(clock) : request.day();
        shipment.describe(day, MaterialTexts.tidy(request.description()), expectsReturn(route, request),
            returnedShipment(user, request.returnOfId()));
        return shipment;
    }

    /**
     * İade kaydı yalnızca bu firmanın dışarı verilen bir sevkiyatına bağlanır. Kimlik doğrulanmadan yazılsaydı başka
     * firmanın sevkiyatına bağlanabilirdi: veritabanının yabancı anahtar denetimi firma ayrımına (RLS) bakmaz.
     */
    private UUID returnedShipment(CurrentUser user, UUID returnOfId) {
        if (returnOfId == null) {
            return null;
        }
        Shipment out = require(user, returnOfId);
        if (out.getType() != ShipmentType.OUTBOUND) {
            throw ApiException.badRequest("İade yalnızca dışarı verilen bir sevkiyata bağlanır.");
        }
        return out.getId();
    }

    /** "Geri gelecek mi?" yalnızca dışarı verilende sorulur; kendi şantiyemize giden mal zaten bizimdir. */
    private static boolean expectsReturn(ShipmentRoute route, ShipmentRequest request) {
        return route.type() == ShipmentType.OUTBOUND && request.expectsReturn();
    }

    private StockLocation placeOf(CurrentUser user, UUID locationId) {
        return locationId == null ? null : locations.require(user.companyId(), locationId);
    }

    private ShipmentLine lineOf(CurrentUser user, Shipment shipment, ShipmentLineRequest line) {
        Material material = materials.findByIdAndCompanyId(line.materialId(), user.companyId())
            .orElseThrow(() -> ApiException.notFound("Malzeme bulunamadı."));
        return new ShipmentLine(shipment.getId(), material.getId(), line.quantity());
    }

    List<ShipmentLine> linesOf(UUID shipmentId) {
        return lines.findByShipmentId(shipmentId);
    }

    Shipment require(CurrentUser user, UUID shipmentId) {
        return shipments.findByIdAndCompanyId(shipmentId, user.companyId())
            .orElseThrow(() -> ApiException.notFound("Sevkiyat bulunamadı."));
    }

    Shipment requireForChange(CurrentUser user, UUID shipmentId) {
        return shipments.findLockedByIdAndCompanyId(shipmentId, user.companyId())
            .orElseThrow(() -> ApiException.notFound("Sevkiyat bulunamadı."));
    }
}
