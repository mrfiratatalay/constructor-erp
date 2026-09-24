package com.atalay.santiye.attendance.dto;

/** Geldi, gelmedi, izinli sayıları. */
public record AttendanceCounts(int present, int absent, int excused) {
}
