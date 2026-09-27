package com.atalay.santiye.rollcall.dto;

import java.util.List;

/** Kişinin ayı (takvim): month "2026-09", ayın özeti ve renklenen günler, eskiden yeniye. */
public record MemberMonthView(RollCallMember member, String month, RollCallCounts counts,
    List<MemberCalendarDay> days) {
}
