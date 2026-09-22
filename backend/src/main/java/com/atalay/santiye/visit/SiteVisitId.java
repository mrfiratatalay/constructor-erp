package com.atalay.santiye.visit;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.UUID;

@Embeddable
record SiteVisitId(UUID userId, UUID siteId) implements Serializable {
}
