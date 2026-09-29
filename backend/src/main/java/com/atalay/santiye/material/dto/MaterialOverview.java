package com.atalay.santiye.material.dto;

import java.util.List;

/**
 * Malzeme detayı: kart, stok (toplam, lokasyon dağılımı, yolda, dışarıda), iadesi beklenen ödünçler ve bütün belgeler.
 * Hareket geçmişi hareket listesinden, bu malzemeyle süzülerek gelir.
 */
public record MaterialOverview(MaterialView material, StockRow stock, List<ReturnRow> awaitingReturns,
    List<MaterialDocumentLine> documents) {
}
