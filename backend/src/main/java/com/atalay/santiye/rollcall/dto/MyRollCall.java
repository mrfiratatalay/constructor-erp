package com.atalay.santiye.rollcall.dto;

import com.atalay.santiye.attendance.AttendanceStatus;
import jakarta.annotation.Nullable;
import java.time.Instant;

/**
 * Kişinin o günkü yoklaması. checkedInAt ve siteName: kendisi katıldıysa ne zaman, hangi şantiyede (başka
 * şantiyenin mesajından katılmış olabilir). Katılmadan patronun işaretlediği günde ikisi de boştur.
 */
public record MyRollCall(AttendanceStatus status, @Nullable Instant checkedInAt, @Nullable String siteName) {
}
