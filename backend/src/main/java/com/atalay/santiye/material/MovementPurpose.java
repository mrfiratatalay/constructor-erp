package com.atalay.santiye.material;

/**
 * Dışarı verilen malzemenin veriliş amacı; yalnızca hareketi anlamlandırır, fatura ya da cari oluşturmaz. Ödünç
 * verilen malzeme geri dönene kadar beklenen iade olarak izlenir.
 */
public enum MovementPurpose {
    SOLD,
    LOANED,
    SUPPORT
}
