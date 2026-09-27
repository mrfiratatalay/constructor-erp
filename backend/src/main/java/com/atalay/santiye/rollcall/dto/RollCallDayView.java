package com.atalay.santiye.rollcall.dto;

import java.time.LocalDate;
import java.util.List;

/** Patronun Yoklama ekranı: bir günün bütün kişileri, ada göre sıralı. */
public record RollCallDayView(LocalDate day, RollCallCounts counts, List<MemberDayView> members) {
}
