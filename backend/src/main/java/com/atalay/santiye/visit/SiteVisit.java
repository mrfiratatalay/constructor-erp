package com.atalay.santiye.visit;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import java.time.Instant;

/** Bir kişinin bir şantiyeye en son bakışı; kişi ve şantiye başına tek satır. */
@Entity
@Table(name = "site_visits")
class SiteVisit {

    @EmbeddedId
    private SiteVisitId id;
    private Instant seenAt;

    protected SiteVisit() {
    }

    void seenAgain(Instant at) {
        this.seenAt = at;
    }

    SiteVisitId getId() {
        return id;
    }

    Instant getSeenAt() {
        return seenAt;
    }
}
