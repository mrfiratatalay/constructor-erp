package com.atalay.santiye.attendance;

/** Geldi, Gelmedi, İzinli. İzinli ayrı durumdur: gelmeme nedeni olarak tekrar yazılmaz. */
public enum AttendanceStatus {
    PRESENT,
    ABSENT,
    EXCUSED
}
