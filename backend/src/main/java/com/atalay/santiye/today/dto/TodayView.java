package com.atalay.santiye.today.dto;

import java.time.LocalDate;
import java.util.List;

/** Sıralama: açık sorunu olanlar, okunmamış haberi olanlar, bugün haber gelmeyenler, sonra son hareket edenler. */
public record TodayView(LocalDate date, TodayTotals totals, List<SiteToday> sites) {
}
