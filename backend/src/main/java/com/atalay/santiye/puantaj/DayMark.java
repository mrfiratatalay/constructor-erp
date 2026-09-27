package com.atalay.santiye.puantaj;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

/** Bir kalemin bir günü: durum, mesai, not; kim, ne zaman işaretledi. İşaretlenmemiş gün yazılmaz. */
@Entity
@Table(name = "puantaj_marks")
class DayMark {

    @EmbeddedId
    private MarkKey id;
    private UUID companyId;
    @Enumerated(EnumType.STRING)
    private DayStatus status;
    private BigDecimal overtimeHours;
    private String note;
    private UUID markedBy;
    private Instant markedAt;

    protected DayMark() {
    }

    DayMark(MarkKey id, UUID companyId) {
        this.id = id;
        this.companyId = companyId;
    }

    void record(Marking marking, UUID by, Instant at) {
        this.status = marking.status();
        this.overtimeHours = marking.overtimeHours();
        this.note = marking.note();
        stamp(by, at);
    }

    /** Toplu işaretleme yalnızca durumu değiştirir: not yerinde kalır, geldi olmayan günün mesaisi silinir. */
    void changeStatus(DayStatus newStatus, UUID by, Instant at) {
        this.status = newStatus;
        if (newStatus != DayStatus.PRESENT) {
            this.overtimeHours = null;
        }
        stamp(by, at);
    }

    /** Saniyeye kırpılır: veritabanı mikro saniyeye yuvarlar, kaydedince dönen saat sonra okunanla aynı kalsın. */
    private void stamp(UUID by, Instant at) {
        this.markedBy = by;
        this.markedAt = at.truncatedTo(ChronoUnit.SECONDS);
    }

    UUID getEntryId() {
        return id.entryId();
    }

    LocalDate getDay() {
        return id.day();
    }

    DayStatus getStatus() {
        return status;
    }

    BigDecimal getOvertimeHours() {
        return overtimeHours;
    }

    String getNote() {
        return note;
    }

    UUID getMarkedBy() {
        return markedBy;
    }

    Instant getMarkedAt() {
        return markedAt;
    }
}
