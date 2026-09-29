package com.atalay.santiye.platform;

import com.atalay.santiye.billing.PaymentMethod;
import com.atalay.santiye.billing.SubscriptionStatus;
import com.atalay.santiye.company.CompanyStatus;

/** İşlem geçmişine yazılan Türkçe adlar: geçmiş, arayüzün çevirisine bağlı kalmadan okunur. */
final class StatusNames {

    private StatusNames() {
    }

    static String of(CompanyStatus status) {
        return switch (status) {
            case ACTIVE -> "aktif";
            case SUSPENDED -> "askıya alındı";
            case ARCHIVED -> "arşivlendi";
        };
    }

    static String of(SubscriptionStatus status) {
        return switch (status) {
            case ACTIVE -> "aktif";
            case SUSPENDED -> "askıya alındı";
            case CANCELLED -> "iptal edildi";
        };
    }

    static String of(PaymentMethod method) {
        return switch (method) {
            case CASH -> "nakit";
            case BANK_TRANSFER -> "havale/EFT";
            case OTHER -> "diğer";
        };
    }
}
