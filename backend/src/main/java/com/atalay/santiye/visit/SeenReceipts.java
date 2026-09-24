package com.atalay.santiye.visit;

import com.atalay.santiye.site.SitePeople;
import com.atalay.santiye.user.AppUser;
import com.atalay.santiye.visit.dto.SeenBy;
import java.time.Instant;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * WhatsApp'taki mavi tikin kaynağı: şantiyenin katılımcıları (firmanın bütün aktif kişileri) ve her birinin
 * şantiyeye son bakışı. Şantiye sayfası açılınca oradaki her mesaj görülmüş sayılır.
 */
@Service
public class SeenReceipts {

    private final SiteVisitRepository visits;
    private final SitePeople people;

    SeenReceipts(SiteVisitRepository visits, SitePeople people) {
        this.visits = visits;
        this.people = people;
    }

    /** Şantiye başına katılımcılar ve son bakışları; sayfa başına sabit sayıda sorgu. */
    @Transactional(readOnly = true)
    public Map<UUID, List<SeenBy>> participantsBySite(UUID companyId, Collection<UUID> siteIds) {
        List<AppUser> everyone = people.of(companyId);
        Map<SiteVisitId, Instant> seen = visits.findBySiteIds(siteIds).stream()
            .collect(Collectors.toMap(SiteVisit::getId, SiteVisit::getSeenAt));
        return siteIds.stream().distinct().collect(Collectors.toMap(Function.identity(), siteId -> everyone.stream()
            .map(user -> new SeenBy(user.getId(), user.getFullName(), seen.get(new SiteVisitId(user.getId(), siteId))))
            .toList()));
    }
}
