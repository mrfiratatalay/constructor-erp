package com.atalay.santiye.rollcall.dto;

import com.atalay.santiye.attendance.AbsenceReason;
import com.atalay.santiye.attendance.AttendanceStatus;
import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotNull;

/** Patronun işareti: Geldi, İzinli ya da Gelmedi + neden (Hastalık, Habersiz, Diğer). */
public record MarkMemberRequest(@NotNull AttendanceStatus status, @Nullable AbsenceReason reason) {
}
