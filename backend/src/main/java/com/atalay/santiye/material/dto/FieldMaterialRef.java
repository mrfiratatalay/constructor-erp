package com.atalay.santiye.material.dto;

import com.atalay.santiye.material.MovementStatus;
import com.atalay.santiye.material.MovementType;
import java.math.BigDecimal;
import java.util.UUID;

/**
 * Saha akışındaki bir gönderinin bağlı olduğu malzeme hareketi, güncel durumuyla: Saha kartı bunu gösterir, tıklanınca
 * hareketin ayrıntısı açılır. Hareket iptal edilirse kart "İptal" der; gönderinin yazısı değişmez.
 */
public record FieldMaterialRef(UUID postId, UUID movementId, long number, MovementType type, MovementStatus status,
    String materialName, BigDecimal quantity, String unit) {
}
