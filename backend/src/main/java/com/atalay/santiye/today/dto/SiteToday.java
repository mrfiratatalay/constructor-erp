package com.atalay.santiye.today.dto;

import com.atalay.santiye.site.dto.SiteLead;
import jakarta.annotation.Nullable;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

/** Bir şantiyenin bugünkü özeti. latestPhotoUrl: bugünün son fotoğrafı (kart görseli). */
public record SiteToday(
    UUID siteId,
    String name,
    List<SiteLead> leads,
    @Nullable Instant lastPostAt,
    long postsToday,
    long photosToday,
    long openIssues,
    boolean noNewsToday,
    @Nullable String latestPhotoUrl) {
}
