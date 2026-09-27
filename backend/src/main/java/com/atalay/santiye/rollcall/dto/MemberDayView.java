package com.atalay.santiye.rollcall.dto;

import jakarta.annotation.Nullable;

/** Yoklama listesinde bir satır. record boşsa kişi o gün katılmadı ve patron henüz işaretlemedi. */
public record MemberDayView(RollCallMember member, @Nullable DayRecord record) {
}
