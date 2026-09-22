package com.atalay.santiye.post;

import com.atalay.santiye.common.persistence.SiteCounts;
import com.atalay.santiye.common.persistence.SiteMoment;
import java.time.Instant;
import java.util.Collection;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Bugün paneli ve bildirimler için şantiye başına gönderi sayıları; her biri tek sorgu. */
@Service
public class PostStats {

    private final PostRepository posts;

    PostStats(PostRepository posts) {
        this.posts = posts;
    }

    @Transactional(readOnly = true)
    public Map<UUID, Instant> lastPostAt(Collection<UUID> siteIds) {
        return posts.findLastPostAt(siteIds).stream().collect(Collectors.toMap(SiteMoment::siteId, SiteMoment::at));
    }

    @Transactional(readOnly = true)
    public Map<UUID, Long> postsSince(Collection<UUID> siteIds, Instant since) {
        return SiteCounts.toMap(posts.countPostsSince(siteIds, since));
    }

    @Transactional(readOnly = true)
    public Map<UUID, Long> openIssues(Collection<UUID> siteIds) {
        return SiteCounts.toMap(posts.countOpenIssues(siteIds));
    }
}
