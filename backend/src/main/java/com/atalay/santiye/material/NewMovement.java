package com.atalay.santiye.material;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

/**
 * Kaydedilecek hareketin doğrulanmış hâli: türün istemediği alanlar burada artık boştur (ör. Kullanıldı'da hedef yok).
 * Kimlik istemcinin ürettiğidir; aynı istek tekrar gelirse ikinci kayıt açılmaz.
 */
record NewMovement(
    UUID id,
    UUID companyId,
    UUID materialId,
    MovementType type,
    MovementStatus status,
    BigDecimal quantity,
    UUID sourceId,
    UUID destinationId,
    UUID partyId,
    MovementPurpose purpose,
    UUID returnOfId,
    LocalDate day,
    MovementNotes notes,
    UUID createdBy) {
}
