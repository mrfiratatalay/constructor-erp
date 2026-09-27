package com.atalay.santiye.rollcall;

import com.atalay.santiye.attendance.AbsenceReason;
import com.atalay.santiye.rollcall.dto.DayRecord;
import java.util.Map;

/**
 * Excel'de bir günün işareti: puantaj harfi, adı ve takvimdeki rengi (yeşil geldi, kırmızı gelmedi, sarı izinli,
 * gri katılmadı). Renkler Excel'in kendi "iyi / kötü / nötr" hücre renkleridir: açıktır, üstündeki yazı okunur.
 */
enum DayMark {
    PRESENT("G", "Geldi", "C6EFCE"),
    ABSENT("Y", "Gelmedi", "FFC7CE"),
    EXCUSED("İ", "İzinli", "FFEB9C"),
    MISSED("K", "Katılmadı", "E7E6E6");

    private static final Map<AbsenceReason, String> REASONS =
        Map.of(AbsenceReason.SICK, "Hastalık", AbsenceReason.UNEXCUSED, "Habersiz", AbsenceReason.OTHER, "Diğer");

    private final String letter;
    private final String label;
    private final String fill;

    DayMark(String letter, String label, String fill) {
        this.letter = letter;
        this.label = label;
        this.fill = fill;
    }

    /** Boş kayıt "katılmadı"dır: o gün yoklama mesajı vardı, kişinin kaydı yok. */
    static DayMark of(DayRecord record) {
        return record == null ? MISSED : valueOf(record.status().name());
    }

    static String reasonLabel(AbsenceReason reason) {
        return reason == null ? null : REASONS.get(reason);
    }

    String letter() {
        return letter;
    }

    String label() {
        return label;
    }

    String fill() {
        return fill;
    }
}
