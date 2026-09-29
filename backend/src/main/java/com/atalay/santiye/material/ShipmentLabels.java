package com.atalay.santiye.material;

/** Sevkiyatın Türkçe adı ve durumu; Excel dökümü ve Saha yazısı bunu kullanır (arayüz kendi sözlüğünü taşır). */
final class ShipmentLabels {

    private ShipmentLabels() {
    }

    static String typeOf(ShipmentType type) {
        return switch (type) {
            case INBOUND -> "Depoya geldi";
            case TO_SITE -> "Şantiyeye gönderildi";
            case TRANSFER -> "Transfer";
            case OUTBOUND -> "Dışarı verildi";
            case RETURN -> "İade geldi";
        };
    }

    static String statusOf(ShipmentStatus status) {
        return switch (status) {
            case RECORDED -> "Kayıtlı";
            case CANCELLED -> "İptal";
        };
    }
}
