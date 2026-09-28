package com.atalay.santiye.material;

/**
 * Hareketin durumu: türünden ayrı bir kavram ("Transfer" türdür, "Yolda" o transferin durumu). Yolda ve kontrol
 * bekleyen hareket hedefin stoğuna henüz girmez; iptal edilen hiçbir stoğa dokunmaz.
 */
public enum MovementStatus {
    PENDING_CHECK,
    IN_TRANSIT,
    DELIVERED,
    COMPLETED,
    AWAITING_RETURN,
    PARTIALLY_RETURNED,
    RETURNED,
    CANCELLED;

    /** Hedef lokasyonun stoğunu artırır mı: teslim alınmamış ya da iptal edilmiş hareket artırmaz. */
    boolean addsToDestination() {
        return this != CANCELLED && !awaitsDelivery();
    }

    /** Teslim alınmayı ya da kontrolü bekliyor: "Teslim alındı" düğmesi yalnızca bunlarda. */
    boolean awaitsDelivery() {
        return this == IN_TRANSIT || this == PENDING_CHECK;
    }
}
