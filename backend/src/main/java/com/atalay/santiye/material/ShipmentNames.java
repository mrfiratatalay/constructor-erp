package com.atalay.santiye.material;

import com.atalay.santiye.material.dto.LocationView;
import java.util.Map;
import java.util.UUID;
import org.springframework.stereotype.Component;

/**
 * Sevkiyatın iki ucunun okunur adı. Uç bir depo ya da şantiye olabilir; dışarıdan gelen ve dışarı giden uçta
 * lokasyon yoktur, orada firmanın adı yazar ("ABC Yapı → Çamburnu Plaza").
 */
@Component
class ShipmentNames {

    private final StockLocations locations;
    private final MaterialParties parties;

    ShipmentNames(StockLocations locations, MaterialParties parties) {
        this.locations = locations;
        this.parties = parties;
    }

    String from(Shipment shipment) {
        if (shipment.getSourceId() != null) {
            return nameOf(shipment.getCompanyId(), shipment.getSourceId());
        }
        return partyName(shipment);
    }

    String to(Shipment shipment) {
        if (shipment.getDestinationId() != null) {
            return nameOf(shipment.getCompanyId(), shipment.getDestinationId());
        }
        return partyName(shipment);
    }

    private String partyName(Shipment shipment) {
        return shipment.getPartyId() == null ? null : parties.nameOf(shipment.getPartyId());
    }

    private String nameOf(UUID companyId, UUID locationId) {
        Map<UUID, LocationView> byId = locations.byId(companyId);
        LocationView location = byId.get(locationId);
        return location == null ? null : location.name();
    }
}
