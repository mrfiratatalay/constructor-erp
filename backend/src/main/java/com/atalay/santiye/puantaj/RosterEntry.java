package com.atalay.santiye.puantaj;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

/**
 * Puantajın bir kalemi: bir çalışan ya da bir taşeron ekip. Uygulamadaki çalışana bağlı kalem (userId) listeye
 * kendiliğinden girer ve adını hesabından alır; uygulaması olmayan kişiyi ya da ekibi şef adıyla ekler.
 * Listeden çıkarılan kalem silinmez: geçmiş günleri puantajda kalır.
 */
@Entity
@Table(name = "roster_entries")
class RosterEntry {

    @Id
    private UUID id;
    private UUID companyId;
    @Enumerated(EnumType.STRING)
    private RosterKind kind;
    private UUID userId;
    private String name;
    private String trade;
    private String phone;
    private Instant archivedAt;
    private Instant createdAt;

    protected RosterEntry() {
    }

    RosterEntry(UUID companyId, RosterKind kind, Instant createdAt) {
        this.id = UUID.randomUUID();
        this.companyId = companyId;
        this.kind = kind;
        this.createdAt = createdAt;
    }

    void describe(String newName, String newTrade, String newPhone) {
        this.name = newName;
        this.trade = newTrade;
        this.phone = newPhone;
    }

    void archive(Instant at) {
        this.archivedAt = at;
    }

    boolean isLinked() {
        return userId != null;
    }

    boolean isArchived() {
        return archivedAt != null;
    }

    UUID getId() {
        return id;
    }

    RosterKind getKind() {
        return kind;
    }

    UUID getUserId() {
        return userId;
    }

    String getName() {
        return name;
    }

    String getTrade() {
        return trade;
    }

    String getPhone() {
        return phone;
    }
}
