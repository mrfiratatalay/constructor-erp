package com.atalay.santiye.material;

/**
 * Sevkiyatın geçmişindeki bir satır: kim, ne zaman ne yaptı. DELIVERED, teslim alma adımının olduğu dönemden
 * kalan kayıtlar için durur: eski satırlar okunmaya devam eder, yenisi yazılmaz.
 */
public enum ShipmentEventKind {
    CREATED,
    DELIVERED,
    UPDATED,
    RETURN_ADDED,
    CANCELLED,
    EDITED,
    DOCUMENT_ADDED
}
