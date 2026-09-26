package com.atalay.santiye.rollcall.dto;

/** Günün özeti, ekranın üstündeki satır: "8 geldi · 1 gelmedi · 1 izinli · 2 katılmadı". */
public record RollCallCounts(long present, long absent, long excused, long missing) {
}
