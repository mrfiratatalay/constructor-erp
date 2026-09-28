package com.atalay.santiye.material;

import java.util.EnumSet;
import java.util.Set;

/**
 * Hareket türlerinin kuralları tek yerde: hangi tür kaynaktan düşer, hangisi hedefe girer, hangisi firmayla olur ve
 * hareket hangi durumla başlar. Stok hesabı da bu tabloya göre yapılır (StockLedger).
 */
final class MovementRules {

    private static final Set<MovementType> WITH_SOURCE = EnumSet.of(MovementType.TO_SITE, MovementType.USED,
        MovementType.TRANSFER, MovementType.OUTBOUND);
    private static final Set<MovementType> WITH_DESTINATION = EnumSet.of(MovementType.INBOUND, MovementType.TO_SITE,
        MovementType.TRANSFER, MovementType.RETURN);
    private static final Set<MovementType> WITH_PARTY = EnumSet.of(MovementType.INBOUND, MovementType.TO_SITE,
        MovementType.TRANSFER, MovementType.OUTBOUND);
    private static final Set<MovementType> CAN_TRAVEL = EnumSet.of(MovementType.TO_SITE, MovementType.TRANSFER);

    private MovementRules() {
    }

    static boolean takesSource(MovementType type) {
        return WITH_SOURCE.contains(type);
    }

    static boolean takesDestination(MovementType type) {
        return WITH_DESTINATION.contains(type);
    }

    /** İade firmasını bağlı olduğu ödünç çıkışından alır; kullanımda firma yoktur. */
    static boolean takesParty(MovementType type) {
        return WITH_PARTY.contains(type);
    }

    /**
     * Başlangıç durumu: yoldaki sevkiyat ve kontrol bekleyen giriş teslimde tamamlanır; ödünç verilen malzeme geri
     * dönüşü bekler; satılan ya da destek verilen teslim edilmiştir; öbürleri kaydedildiği anda tamamdır.
     */
    static MovementStatus initialStatus(MovementType type, MovementPurpose purpose, boolean inTransit,
        boolean pendingCheck) {
        if (CAN_TRAVEL.contains(type) && inTransit) {
            return MovementStatus.IN_TRANSIT;
        }
        if (type == MovementType.INBOUND && pendingCheck) {
            return MovementStatus.PENDING_CHECK;
        }
        if (type == MovementType.OUTBOUND) {
            return purpose == MovementPurpose.LOANED ? MovementStatus.AWAITING_RETURN : MovementStatus.DELIVERED;
        }
        return MovementStatus.COMPLETED;
    }

    static String missingSource(MovementType type) {
        return type == MovementType.USED ? "Malzemenin kullanıldığı yeri seç." : "Malzemenin nereden çıktığını seç.";
    }

    static String missingDestination(MovementType type) {
        return switch (type) {
            case TO_SITE -> "Malzemenin hangi şantiyeye gittiğini seç.";
            case RETURN -> "Malzemenin döndüğü yeri seç.";
            default -> "Malzemenin nereye gittiğini seç.";
        };
    }
}
