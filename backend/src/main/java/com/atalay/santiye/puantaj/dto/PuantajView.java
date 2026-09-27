package com.atalay.santiye.puantaj.dto;

import java.time.LocalDate;
import java.util.List;

/**
 * İstenen günlerin puantajı: bugünün ekranı (son günler) ve ayın cetveli aynı cevabı kullanır. today: sunucunun
 * saatine göre bugün; şef yalnızca bugünü işaretler. entries: önce kişiler sonra ekipler, ada göre sıralı. marks:
 * yalnızca işaretlenmiş günler; kaydı olmayan gün "İşaretlenmedi"dir.
 */
public record PuantajView(
    LocalDate from,
    LocalDate to,
    LocalDate today,
    List<RosterEntryView> entries,
    List<DayMarkView> marks) {
}
