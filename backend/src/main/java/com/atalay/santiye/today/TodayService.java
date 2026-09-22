package com.atalay.santiye.today;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.media.MediaStats;
import com.atalay.santiye.post.PostStats;
import com.atalay.santiye.site.SiteService;
import com.atalay.santiye.site.SiteStatus;
import com.atalay.santiye.site.dto.SiteView;
import com.atalay.santiye.today.dto.SiteToday;
import com.atalay.santiye.today.dto.TodayTotals;
import com.atalay.santiye.today.dto.TodayView;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Patronun sabah ilk baktığı ekran: aktif şantiyelerin bugünü, dikkat isteyen en üstte. */
@Service
public class TodayService {

    /** Önce açık sorunu olanlar, sonra bugün haber gelmeyenler, sonra en son hareket eden. */
    private static final Comparator<SiteToday> ATTENTION_FIRST = Comparator
        .comparing((SiteToday site) -> site.openIssues() == 0)
        .thenComparing(site -> !site.noNewsToday())
        .thenComparing(SiteToday::lastPostAt, Comparator.nullsLast(Comparator.reverseOrder()));

    private final SiteService sites;
    private final PostStats postStats;
    private final MediaStats mediaStats;
    private final Clock clock;

    TodayService(SiteService sites, PostStats postStats, MediaStats mediaStats, Clock clock) {
        this.sites = sites;
        this.postStats = postStats;
        this.mediaStats = mediaStats;
        this.clock = clock;
    }

    private record DayStats(Map<UUID, Instant> lastPostAt, Map<UUID, Long> posts, Map<UUID, Long> photos,
        Map<UUID, Long> openIssues, Map<UUID, String> photoUrls) {
    }

    /** "Bugün" şantiyenin saat dilimine göre: gece yarısı İstanbul'un gece yarısıdır. */
    @Transactional(readOnly = true)
    public TodayView today(CurrentUser user) {
        LocalDate date = LocalDate.now(clock);
        Instant startOfDay = date.atStartOfDay(clock.getZone()).toInstant();
        List<SiteView> active = sites.listSites(user).stream().filter(site -> site.status() == SiteStatus.ACTIVE).toList();
        if (active.isEmpty()) {
            return new TodayView(date, new TodayTotals(0, 0, 0, 0, 0), List.of());
        }
        DayStats stats = collect(active.stream().map(SiteView::id).toList(), startOfDay);
        List<SiteToday> rows = active.stream().map(site -> summarize(site, stats)).sorted(ATTENTION_FIRST).toList();
        return new TodayView(date, totalsOf(rows), rows);
    }

    private DayStats collect(List<UUID> siteIds, Instant startOfDay) {
        return new DayStats(
            postStats.lastPostAt(siteIds),
            postStats.postsSince(siteIds, startOfDay),
            mediaStats.photosSince(siteIds, startOfDay),
            postStats.openIssues(siteIds),
            mediaStats.latestPhotoThumbnails(siteIds, startOfDay));
    }

    private static SiteToday summarize(SiteView site, DayStats stats) {
        long postsToday = stats.posts().getOrDefault(site.id(), 0L);
        return new SiteToday(site.id(), site.name(), site.leads(), stats.lastPostAt().get(site.id()), postsToday,
            stats.photos().getOrDefault(site.id(), 0L), stats.openIssues().getOrDefault(site.id(), 0L),
            postsToday == 0, stats.photoUrls().get(site.id()));
    }

    private static TodayTotals totalsOf(List<SiteToday> rows) {
        return new TodayTotals(
            rows.size(),
            rows.stream().mapToLong(SiteToday::postsToday).sum(),
            rows.stream().mapToLong(SiteToday::photosToday).sum(),
            rows.stream().mapToLong(SiteToday::openIssues).sum(),
            (int) rows.stream().filter(SiteToday::noNewsToday).count());
    }
}
