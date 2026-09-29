package com.atalay.santiye.material.dto;

import com.atalay.santiye.material.ShipmentStatus;
import com.atalay.santiye.material.ShipmentType;
import java.util.UUID;

/**
 * Saha akışındaki bir gönderinin bağlı olduğu sevkiyat, güncel durumuyla: Saha kartı bunu gösterir, dokununca
 * sevkiyat açılır. Sevkiyat iptal edilirse kart "İptal" der; gönderinin yazısı değişmez.
 */
public record FieldShipmentRef(UUID postId, UUID shipmentId, long number, ShipmentType type, ShipmentStatus status,
    String summary) {
}
