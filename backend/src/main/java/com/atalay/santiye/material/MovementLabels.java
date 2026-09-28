package com.atalay.santiye.material;

/** Türlerin, durumların ve amaçların ekrandaki Türkçe adları (Excel ve Saha yazıları için; arayüzün kendi adları var). */
final class MovementLabels {

    private MovementLabels() {
    }

    static String type(MovementType type) {
        return switch (type) {
            case INBOUND -> "Geldi";
            case TO_SITE -> "Şantiyeye Gönderildi";
            case USED -> "Kullanıldı";
            case TRANSFER -> "Transfer";
            case OUTBOUND -> "Dışarı Verildi";
            case RETURN -> "İade";
            case ADJUSTMENT -> "Sayım Düzeltmesi";
        };
    }

    static String status(MovementStatus status) {
        return switch (status) {
            case PENDING_CHECK -> "Kontrol Bekliyor";
            case IN_TRANSIT -> "Yolda";
            case DELIVERED -> "Teslim Edildi";
            case COMPLETED -> "Tamamlandı";
            case AWAITING_RETURN -> "Geri Dönüş Bekliyor";
            case PARTIALLY_RETURNED -> "Kısmi İade";
            case RETURNED -> "İade Tamamlandı";
            case CANCELLED -> "İptal";
        };
    }

    static String purpose(MovementPurpose purpose) {
        if (purpose == null) {
            return null;
        }
        return switch (purpose) {
            case SOLD -> "Satıldı";
            case LOANED -> "Ödünç Verildi";
            case SUPPORT -> "Destek / Karşılıksız";
        };
    }

    static String stock(StockStatus status) {
        return switch (status) {
            case NORMAL -> "Normal";
            case CRITICAL -> "Kritik";
            case OUT -> "Tükendi";
        };
    }
}
