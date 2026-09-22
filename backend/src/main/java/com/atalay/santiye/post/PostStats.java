package com.atalay.santiye.post;

import com.atalay.santiye.common.persistence.SiteCounts;
import com.atalay.santiye.common.persistence.SiteMoment;
import com.atalay.santiye.post.dto.PostView;
import java.time.Instant;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Ana ekran ve bildirimler için şantiye başına gönderi özetleri; her biri tek sorgu. */
@Service
public class PostStats {

    private final PostRepository posts;
    private final PostViews views;

    PostStats(PostRepository posts, PostViews views) {
        this.posts = posts;
        this.views = views;
    }

    @Transactional(readOnly = true)
    public Map<UUID, Instant> lastPostAt(Collection<UUID> siteIds) {
        return momentsBySite(posts.findLastPostAt(siteIds));
    }

    @Transactional(readOnly = true)
    public Map<UUID, Long> postsSince(Collection<UUID> siteIds, Instant since) {
        return SiteCounts.toMap(posts.countPostsSince(siteIds, since));
    }

    @Transactional(readOnly = true)
    public Map<UUID, Long> openIssues(Collection<UUID> siteIds) {
        return SiteCounts.toMap(posts.countOpenIssues(siteIds));
    }

    @Transactional(readOnly = true)
    public Map<UUID, Instant> oldestOpenIssueAt(Collection<UUID> siteIds) {
        return momentsBySite(posts.findOldestOpenIssueAt(siteIds));
    }

    /** Şantiye başına en son gönderi; aynı anda iki gönderi düşmüşse biri seçilir. */
    @Transactional(readOnly = true)
    public Map<UUID, PostView> latestPosts(Collection<UUID> siteIds) {
        Map<UUID, PostView> latest = new HashMap<>();
        for (PostView post : views.of(posts.findLatestPerSite(siteIds))) {
            latest.putIfAbsent(post.site().id(), post);
        }
        return latest;
    }

    private static Map<UUID, Instant> momentsBySite(Collection<SiteMoment> moments) {
        return moments.stream().collect(Collectors.toMap(SiteMoment::siteId, SiteMoment::at));
    }
}
