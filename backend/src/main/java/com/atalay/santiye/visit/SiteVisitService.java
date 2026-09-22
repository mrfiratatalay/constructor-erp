package com.atalay.santiye.visit;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.common.persistence.SiteCounts;
import com.atalay.santiye.site.SiteAccess;
import com.atalay.santiye.visit.dto.SiteVisitView;
import java.time.Clock;
import java.time.Instant;
import java.util.Collection;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Okundu bilgisi: şantiye sayfası açılınca o şantiyenin bütün gönderileri okunmuş sayılır (WhatsApp gibi). */
@Service
public class SiteVisitService {

    private final SiteVisitRepository visits;
    private final SiteAccess siteAccess;
    private final Clock clock;

    SiteVisitService(SiteVisitRepository visits, SiteAccess siteAccess, Clock clock) {
        this.visits = visits;
        this.siteAccess = siteAccess;
        this.clock = clock;
    }

    /** Önceki bakışı döner ve yenisini yazar: sayfa, önceki bakıştan sonra gelenleri "yeni" diye ayırır. */
    @Transactional
    public SiteVisitView visit(CurrentUser user, UUID siteId) {
        siteAccess.requireVisible(user, siteId);
        Instant now = clock.instant();
        SiteVisitId id = new SiteVisitId(user.userId(), siteId);
        Optional<SiteVisit> existing = visits.findById(id);
        Instant previous = existing.map(SiteVisit::getSeenAt).orElse(null);
        existing.ifPresentOrElse(visit -> visit.seenAgain(now), () -> visits.save(new SiteVisit(id, now)));
        return new SiteVisitView(previous);
    }

    @Transactional(readOnly = true)
    public Map<UUID, Long> unreadPosts(UUID userId, Collection<UUID> siteIds, Instant since) {
        return SiteCounts.toMap(visits.countUnread(userId, siteIds, since));
    }
}
