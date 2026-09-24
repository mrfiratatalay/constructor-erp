package com.atalay.santiye.pin;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import java.time.Instant;

/** Kişinin listede en üste sabitlediği şantiye; kişi ve şantiye başına tek satır. */
@Entity
@Table(name = "site_pins")
class SitePin {

    @EmbeddedId
    private SitePinId id;
    private Instant pinnedAt;

    protected SitePin() {
    }

    SitePin(SitePinId id, Instant pinnedAt) {
        this.id = id;
        this.pinnedAt = pinnedAt;
    }

    SitePinId getId() {
        return id;
    }

    Instant getPinnedAt() {
        return pinnedAt;
    }
}
