package com.atalay.santiye.attendance;

/** Bir kişinin o günkü işareti; doğrulanmış hâliyle (neden yalnızca "Gelmedi"de, boş not yok). */
record EntryMark(AttendanceStatus status, AbsenceReason reason, String note) {
}
