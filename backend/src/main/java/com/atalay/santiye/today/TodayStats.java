package com.atalay.santiye.today;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.media.MediaStats;
import com.atalay.santiye.pin.SitePins;
import com.atalay.santiye.post.PostStats;
import com.atalay.santiye.site.SiteEvents;
import com.atalay.santiye.visit.SiteVisitService;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Component;

/** Ana ekranın verisini toplar: şantiye sayısından bağımsız, sabit sayıda sorgu. */
@Component
class TodayStats {

    /** Ana ekrandaki satırda yan yana gösterilen fotoğraf sayısı. */
    private static final int PHOTO_STRIP = 3;

    private final PostStats posts;
    private final MediaStats media;
    private final SiteVisitService visits;
    private final SiteEvents events;
    private final SitePins pins;

    TodayStats(PostStats posts, MediaStats media, SiteVisitService visits, SiteEvents events, SitePins pins) {
        this.posts = posts;
        this.media = media;
        this.visits = visits;
        this.events = events;
        this.pins = pins;
    }

    DayStats collect(CurrentUser user, List<UUID> siteIds, Instant startOfDay) {
        return new DayStats(
            posts.lastPostAt(siteIds),
            posts.latestPosts(siteIds),
            posts.postsSince(siteIds, startOfDay),
            media.photosSince(siteIds, startOfDay),
            visits.unreadPosts(user.userId(), siteIds, startOfDay),
            posts.openIssues(siteIds),
            posts.oldestOpenIssueAt(siteIds),
            media.recentPhotoThumbnails(siteIds, startOfDay, PHOTO_STRIP),
            events.latestBySite(siteIds),
            pins.pinnedAt(user.userId()));
    }
}
