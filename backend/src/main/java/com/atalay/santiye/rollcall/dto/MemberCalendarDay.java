package com.atalay.santiye.rollcall.dto;

import jakarta.annotation.Nullable;
import java.time.LocalDate;

/**
 * Takvimde renklenen bir gün. record boşsa kişi o gün katılmadı: firmada yoklama mesajı atıldı ama kaydı yok.
 * Yoklama hiç alınmayan gün (pazar) listede yoktur: o gün için "gelmedi" demek yanlış olurdu.
 */
public record MemberCalendarDay(LocalDate day, @Nullable DayRecord record) {
}
