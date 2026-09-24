package com.atalay.santiye.today;

import com.atalay.santiye.post.dto.PostView;
import com.atalay.santiye.site.dto.SiteEventView;
import com.atalay.santiye.site.dto.SiteView;
import com.atalay.santiye.today.dto.SiteToday;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/** Şantiye başına toplanmış ham sayılar; her harita tek sorgunun sonucudur. */
record DayStats(
    Map<UUID, Instant> lastPostAt,
    Map<UUID, PostView> latestPosts,
    Map<UUID, Long> postsToday,
    Map<UUID, Long> photosToday,
    Map<UUID, Long> unreadPosts,
    Map<UUID, Long> openIssues,
    Map<UUID, Instant> oldestOpenIssueAt,
    Map<UUID, List<String>> recentPhotos,
    Map<UUID, SiteEventView> latestEvents,
    Map<UUID, Instant> pinnedAt) {

    SiteToday summarize(SiteView site) {
        UUID id = site.id();
        long posts = postsToday.getOrDefault(id, 0L);
        return new SiteToday(id, site.name(), site.leads(), lastPostAt.get(id), latestPosts.get(id), posts,
            photosToday.getOrDefault(id, 0L), unreadPosts.getOrDefault(id, 0L), openIssues.getOrDefault(id, 0L),
            oldestOpenIssueAt.get(id), posts == 0, recentPhotos.getOrDefault(id, List.of()), latestEvents.get(id),
            pinnedAt.get(id), site.photoThumbnailUrl());
    }
}
