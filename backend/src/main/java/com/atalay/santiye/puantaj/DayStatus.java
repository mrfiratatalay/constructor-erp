package com.atalay.santiye.puantaj;

/**
 * Bir günün durumu. İşaretlenmemiş gün bu listede yoktur: kaydı olmayan gün "İşaretlenmedi"dir, "Gelmedi" değil.
 * Yarım gün puantajda yarım gün sayılır; izinli gün gelmedi sayılmaz. Ekip yalnızca geldi ya da gelmedi olur.
 */
public enum DayStatus {
    PRESENT,
    HALF_DAY,
    ABSENT,
    LEAVE;

    boolean allowedFor(RosterKind kind) {
        return kind == RosterKind.PERSON || this == PRESENT || this == ABSENT;
    }
}
