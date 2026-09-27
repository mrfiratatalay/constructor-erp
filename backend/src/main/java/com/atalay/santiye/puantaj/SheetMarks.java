package com.atalay.santiye.puantaj;

import java.math.BigDecimal;
import java.util.EnumMap;
import java.util.Map;

/**
 * Excel'de bir günün işareti: puantaj harfi, adı ve ekrandaki etiketle aynı renk (yeşil geldi, sarı yarım gün,
 * kırmızı gelmedi, mavi izinli). Renkler açıktır, üstündeki harf okunur. Mesai harfin yanına yazılır: "G+2".
 */
final class SheetMarks {

    static final String HEADER_FILL = "1E3A5F";
    static final String LEGEND = "G: Geldi · Y: Yarım gün · X: Gelmedi · İ: İzinli · G+2: 2 saat mesai · "
        + "Boş: işaretlenmedi";

    private record Look(String letter, String label, String fill) {
    }

    private static final Map<DayStatus, Look> LOOKS = new EnumMap<>(Map.of(
        DayStatus.PRESENT, new Look("G", "Geldi", "C6EFCE"),
        DayStatus.HALF_DAY, new Look("Y", "Yarım gün", "FFEB9C"),
        DayStatus.ABSENT, new Look("X", "Gelmedi", "FFC7CE"),
        DayStatus.LEAVE, new Look("İ", "İzinli", "DDEBF7")));

    private SheetMarks() {
    }

    static String cell(DayMark mark) {
        String letter = LOOKS.get(mark.getStatus()).letter();
        return mark.getOvertimeHours() == null ? letter : letter + "+" + hours(mark.getOvertimeHours());
    }

    static String label(DayStatus status) {
        return LOOKS.get(status).label();
    }

    static String fill(DayStatus status) {
        return LOOKS.get(status).fill();
    }

    /** Türkçe yazımla: 1,5. */
    static String hours(BigDecimal value) {
        return value.stripTrailingZeros().toPlainString().replace('.', ',');
    }
}
