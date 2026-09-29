package com.atalay.santiye.material;

import com.atalay.santiye.common.error.ApiException;
import java.util.UUID;

/**
 * Sevkiyatın iki ucu ve bu uçlardan çıkan adı. Kullanıcıya "hangi tür hareket?" diye sorulmaz; o yalnızca nereye
 * gittiğini söyler, tür buradan hesaplanır. Dışarıdan gelen ve dışarı giden uçta lokasyon yerine firma vardır.
 */
record ShipmentRoute(ShipmentType type, UUID sourceId, UUID destinationId, UUID partyId) {

    static ShipmentRoute of(StockLocation source, StockLocation destination, UUID partyId, boolean back) {
        if (source == null && destination == null) {
            throw ApiException.badRequest("Sevkiyatın en az bir ucu depo ya da şantiye olmalı.");
        }
        if (source == null) {
            requireParty(partyId, "Malzemenin kimden geldiği yazılmalı.");
            ShipmentType type = back ? ShipmentType.RETURN : ShipmentType.INBOUND;
            return new ShipmentRoute(type, null, destination.getId(), partyId);
        }
        if (destination == null) {
            requireParty(partyId, "Malzemenin kime verildiği yazılmalı.");
            return new ShipmentRoute(ShipmentType.OUTBOUND, source.getId(), null, partyId);
        }
        if (source.getId().equals(destination.getId())) {
            throw ApiException.badRequest("Sevkiyatın çıkış ve varış yeri aynı olamaz.");
        }
        ShipmentType type = destination.getKind() == LocationKind.SITE ? ShipmentType.TO_SITE : ShipmentType.TRANSFER;
        return new ShipmentRoute(type, source.getId(), destination.getId(), partyId);
    }

    private static void requireParty(UUID partyId, String problem) {
        if (partyId == null) {
            throw ApiException.badRequest(problem);
        }
    }
}
