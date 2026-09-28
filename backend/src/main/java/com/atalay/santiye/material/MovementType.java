package com.atalay.santiye.material;

/**
 * Hareketin türü: malzemenin ne yaptığı. INBOUND geldi, TO_SITE şantiyeye gönderildi, USED kullanıldı, TRANSFER şirket
 * içi iki lokasyon arası, OUTBOUND dışarı verildi (firma ya da müteahhide), RETURN dışarı verilenin geri gelişi,
 * ADJUSTMENT sayım düzeltmesi (yalnızca stok detayından, normal hareket seçeneklerinde yoktur).
 */
public enum MovementType {
    INBOUND,
    TO_SITE,
    USED,
    TRANSFER,
    OUTBOUND,
    RETURN,
    ADJUSTMENT
}
