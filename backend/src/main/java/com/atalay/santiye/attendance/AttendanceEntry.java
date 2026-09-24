package com.atalay.santiye.attendance;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;

/** Yoklamada bir kişinin o günkü durumu: geldi, gelmedi (nedeniyle) ya da izinli; isteğe bağlı not. */
@Entity
@Table(name = "attendance_entries")
class AttendanceEntry {

    @EmbeddedId
    private AttendanceEntryId id;
    @Enumerated(EnumType.STRING)
    private AttendanceStatus status;
    @Enumerated(EnumType.STRING)
    private AbsenceReason reason;
    private String note;

    protected AttendanceEntry() {
    }

    AttendanceEntry(AttendanceEntryId id, EntryMark mark) {
        this.id = id;
        this.status = mark.status();
        this.reason = mark.reason();
        this.note = mark.note();
    }

    AttendanceEntryId getId() {
        return id;
    }

    AttendanceStatus getStatus() {
        return status;
    }

    AbsenceReason getReason() {
        return reason;
    }

    String getNote() {
        return note;
    }
}
