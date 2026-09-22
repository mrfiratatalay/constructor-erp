package com.atalay.santiye.common.persistence;

import java.time.Instant;
import java.util.UUID;

/** Şantiye başına bir an (ör. son gönderinin zamanı). */
public record SiteMoment(UUID siteId, Instant at) {
}
