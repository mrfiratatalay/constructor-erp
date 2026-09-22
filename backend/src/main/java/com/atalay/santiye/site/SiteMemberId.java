package com.atalay.santiye.site;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.UUID;

@Embeddable
record SiteMemberId(UUID siteId, UUID userId) implements Serializable {
}
