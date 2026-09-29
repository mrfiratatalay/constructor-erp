package com.atalay.santiye.material;

/**
 * Sevkiyatın adı. Kullanıcı bunu seçmez: "nereden nereye" sorusunun cevabından sunucu hesaplar (ShipmentRoute) ve
 * ekran yalnızca sonucu yazar ("Şantiyeye gönderildi").
 */
public enum ShipmentType {
    INBOUND,
    TO_SITE,
    TRANSFER,
    OUTBOUND,
    RETURN
}
