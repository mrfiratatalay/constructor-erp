package com.atalay.santiye.rollcall;

import com.atalay.santiye.attendance.AbsenceReason;
import com.atalay.santiye.attendance.AttendanceStatus;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

/**
 * Firmadaki bir kişinin bir günlük yoklaması: kendisi "Yoklamaya Katıl"a bastıysa geldi (hangi şantiyede, saat
 * kaçta); katılmadıysa patron işaretler. Patron sonradan değiştirse de katılma izi kalır.
 */
@Entity
@Table(name = "member_attendance")
class MemberAttendance {

    @EmbeddedId
    private MemberDay id;
    private UUID companyId;
    @Enumerated(EnumType.STRING)
    private AttendanceStatus status;
    @Enumerated(EnumType.STRING)
    private AbsenceReason reason;
    private UUID siteId;
    private Instant checkedInAt;
    private UUID markedBy;
    private Instant markedAt;

    protected MemberAttendance() {
    }

    MemberAttendance(MemberDay id, UUID companyId) {
        this.id = id;
        this.companyId = companyId;
    }

    /**
     * Kendisi katıldı: geldi. Patronun önceki işareti (izinli, gelmedi) katılmayla düzelir: telefonundan basması
     * geldiğinin kanıtıdır. İkinci bir şantiyenin mesajına basmak ilk katılmanın yerini ve saatini değiştirmez.
     */
    void checkIn(UUID atSiteId, Instant at) {
        this.status = AttendanceStatus.PRESENT;
        this.reason = null;
        if (checkedInAt == null) {
            this.siteId = atSiteId;
            this.checkedInAt = at;
        }
    }

    /** Patron işaretler: durum ve neden değişir, kimin ne zaman işaretlediği yazılır. */
    void mark(AttendanceStatus newStatus, AbsenceReason newReason, UUID by, Instant at) {
        this.status = newStatus;
        this.reason = newReason;
        this.markedBy = by;
        this.markedAt = at;
    }

    boolean hasCheckedIn() {
        return checkedInAt != null && status == AttendanceStatus.PRESENT;
    }

    MemberDay getId() {
        return id;
    }

    AttendanceStatus getStatus() {
        return status;
    }

    AbsenceReason getReason() {
        return reason;
    }

    UUID getSiteId() {
        return siteId;
    }

    Instant getCheckedInAt() {
        return checkedInAt;
    }

    UUID getMarkedBy() {
        return markedBy;
    }

    Instant getMarkedAt() {
        return markedAt;
    }
}
