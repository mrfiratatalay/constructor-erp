package com.atalay.santiye.material;

import org.springframework.stereotype.Component;

/**
 * Sevkiyat ekranının okuma tarafındaki parçaları tek nesnede. Controller'ın kurucusu böylece dört parametreyi
 * aşmaz (kod kuralı: en fazla dört parametre); her parça kendi işini yapmayı sürdürür.
 */
@Component
record ShipmentParts(ShipmentRows rows, ShipmentDetails details, Stock stock, MaterialDocuments documents,
    FieldShipments fieldShipments) {
}
