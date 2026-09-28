package com.atalay.santiye.material.dto;

/**
 * Ekranın üstündeki özet kartları. Ton, torba ve m² tek sayıda toplanamaz: kartlar kalem, hareket ve kayıt sayar.
 * activeMaterials: aktif malzeme çeşidi. sentToSitesThisMonth ve outboundThisMonth: bu ayın şantiyeye gönderim ve
 * firma dışı çıkış hareketleri. awaitingReturns: iadesi beklenen ödünç kayıtları, overdueReturns bunların beklenen
 * tarihi geçmiş olanları. awaitingDelivery: yolda ya da kontrol bekleyen hareketler.
 */
public record MaterialSummary(long activeMaterials, long sentToSitesThisMonth, long outboundThisMonth,
    long awaitingReturns, long overdueReturns, long awaitingDelivery) {
}
