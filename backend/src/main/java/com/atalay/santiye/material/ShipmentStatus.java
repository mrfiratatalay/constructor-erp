package com.atalay.santiye.material;

/**
 * Sevkiyatın iki hali: kayıtlı ve iptal. "Yolda / teslim alındı" ayrımı kaldırıldı — kamyonun vardığını ayrıca
 * onaylatmak bu işin gerçeğine uymayan bir bürokrasiydi; kimse basmayınca kayıt sonsuza kadar yolda görünürdü.
 */
public enum ShipmentStatus {
    RECORDED,
    CANCELLED
}
