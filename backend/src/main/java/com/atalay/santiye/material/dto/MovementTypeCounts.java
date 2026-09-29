package com.atalay.santiye.material.dto;

/** Tür çiplerinin sayıları: Tümü, Gelen, Şantiyeye Giden, Kullanılan, Transfer, Dışarı Verilen, İade, Sayım. */
public record MovementTypeCounts(long all, long inbound, long toSite, long used, long transfer, long outbound,
    long returns, long adjustment) {
}
