package com.atalay.santiye.today;

import com.atalay.santiye.auth.CurrentUser;
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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Ana ekran: aktif şantiyelerin bugünü, dikkat isteyen en üstte. */
@Service
public class TodayService {

    /** Önce açık sorunu olanlar, sonra okunmamış haberi olanlar, sonra sessizler, sonra en son hareket eden. */
    private static final Comparator<SiteToday> ATTENTION_FIRST = Comparator
        .comparing((SiteToday site) -> site.openIssues() == 0)
        .thenComparing(site -> site.unreadPosts() == 0)
        .thenComparing(site -> !site.noNewsToday())
        .thenComparing(SiteToday::lastPostAt, Comparator.nullsLast(Comparator.reverseOrder()));

    private final SiteService sites;
    private final TodayStats stats;
    private final Clock clock;

    TodayService(SiteService sites, TodayStats stats, Clock clock) {
        this.sites = sites;
        this.stats = stats;
        this.clock = clock;
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
        DayStats day = stats.collect(user, active.stream().map(SiteView::id).toList(), startOfDay);
        List<SiteToday> rows = active.stream().map(day::summarize).sorted(ATTENTION_FIRST).toList();
        return new TodayView(date, totalsOf(rows), rows);
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
