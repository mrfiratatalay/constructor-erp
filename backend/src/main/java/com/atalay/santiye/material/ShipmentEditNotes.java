package com.atalay.santiye.material;

import com.atalay.santiye.material.dto.ShipmentEditRequest;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/** Düzeltmenin eski ve yeni değerleri, hareket tekrar değişse bile geçmişte okunabilir. */
final class ShipmentEditNotes {

    private ShipmentEditNotes() {
    }

    static String of(Shipment shipment, ShipmentEditRequest request) {
        List<String> changes = new ArrayList<>();
        if (!Objects.equals(shipment.getDay(), request.day())) {
            changes.add("Tarih: " + shipment.getDay() + " → " + request.day());
        }
        if (!Objects.equals(shipment.getDescription(), request.description())) {
            changes.add("Açıklama: " + text(shipment.getDescription()) + " → " + text(request.description()));
        }
        return String.join("\n", changes);
    }

    private static String text(String value) {
        return value == null ? "—" : value;
    }
}
