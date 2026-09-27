package com.atalay.santiye.rollcall.dto;

import jakarta.annotation.Nullable;
import java.time.LocalDate;

/**
 * Sohbetteki yoklama kartı. open: bugünün yoklaması, katılınabilir (dünkü mesaj kapanmıştır). joinedCount: bu
 * şantiyede kendisi katılanlar. mine: bakan kişinin o günkü yoklaması; patron yoklamada sayılmaz, onda hep boş.
 */
public record RollCallView(LocalDate day, boolean open, long joinedCount, @Nullable MyRollCall mine) {
}
