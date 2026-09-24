package com.atalay.santiye.pin;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.UUID;

@Embeddable
record SitePinId(UUID userId, UUID siteId) implements Serializable {
}
