package com.atalay.santiye.material;

import java.util.List;

/**
 * Saha gönderisinin yazısı. Saha simgesi yazıdan okunur ("geldi" teslimattır, 📦): şantiyeye gelen sevkiyat
 * "geldi", şantiyeden çıkan "gönderildi" der. Tarih ve saat gönderinin kendisindedir.
 */
record FieldTexts(Shipment shipment, List<String> items, String from, String to) {

    String body(boolean arriving) {
        return headline(arriving) + ": " + String.join(", ", items) + route();
    }

    private String headline(boolean arriving) {
        if (shipment.getType() == ShipmentType.OUTBOUND) {
            return "Malzeme dışarı verildi";
        }
        return arriving ? "Malzeme geldi" : "Malzeme gönderildi";
    }

    private String route() {
        if (from != null && to != null) {
            return " (" + from + " → " + to + ")";
        }
        String only = from != null ? from : to;
        return only == null ? "" : " (" + only + ")";
    }
}
