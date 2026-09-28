package com.atalay.santiye.puantaj.dto;

import java.time.LocalDate;
import java.util.List;

/**
 * Puantajım: çalışanın istenen aydaki kendi günleri. counted: yoklamada sayılıyor mu (patron ve şef sayılmaz,
 * listesi boş döner). today: firmanın saatine göre bugün. Yalnızca işaretlenmiş günler gelir.
 */
public record MyPuantajView(
    LocalDate from,
    LocalDate to,
    LocalDate today,
    boolean counted,
    List<MyDayView> days) {
}
