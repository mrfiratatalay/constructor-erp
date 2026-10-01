package com.atalay.santiye.pin;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import java.time.Instant;

/** Kişinin listede en üste sabitlediği şantiye; kişi ve şantiye başına tek satır. Satır SitePinRepository'de eklenir. */
@Entity
@Table(name = "site_pins")
class SitePin {

    @EmbeddedId
    private SitePinId id;
    private Instant pinnedAt;

    protected SitePin() {
    }

    SitePinId getId() {
        return id;
    }

    Instant getPinnedAt() {
        return pinnedAt;
    }
}
