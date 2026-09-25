package com.atalay.santiye.site;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.site.dto.SiteEventView;
import com.atalay.santiye.user.AppUser;
import com.atalay.santiye.user.UserRepository;
import java.time.Clock;
import java.time.Instant;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Şantiyenin sistem satırları: kuruldu, kişi katıldı, kişi çıkarıldı. Akışta olduğu anın yerinde durur
 * (WhatsApp'taki "Mahmut davet bağlantısıyla katıldı" gibi).
 */
@Service
public class SiteEvents {

    private final SiteEventRepository events;
    private final SiteRepository sites;
    private final UserRepository users;
    private final SiteAccess siteAccess;
    private final Clock clock;

    SiteEvents(SiteEventRepository events, SiteRepository sites, UserRepository users, SiteAccess siteAccess,
        Clock clock) {
        this.events = events;
        this.sites = sites;
        this.users = users;
        this.siteAccess = siteAccess;
        this.clock = clock;
    }

    void record(UUID siteId, SiteEventKind kind, UUID actorId, UUID subjectId) {
        events.save(new SiteEvent(siteId, kind, actorId, subjectId, clock.instant()));
    }

    /**
     * Kişi firmaya katıldı ya da firmadan çıkarıldı: herkes her şantiyede olduğu için satır her şantiyenin
     * akışına düşer.
     */
    @Transactional
    public void recordInEverySite(UUID companyId, SiteEventKind kind, UUID actorId, UUID subjectId) {
        Instant now = clock.instant();
        events.saveAll(sites.findByCompanyIdOrderByName(companyId).stream()
            .map(site -> new SiteEvent(site.getId(), kind, actorId, subjectId, now))
            .toList());
    }

    @Transactional(readOnly = true)
    public List<SiteEventView> list(CurrentUser user, UUID siteId) {
        siteAccess.requireVisible(user, siteId);
        return views(events.findBySite(siteId));
    }

    /**
     * Listede sayılan sistem satırı: yalnızca kuruluş ("Patron şantiyeyi kurdu"; hiç mesajı olmayan şantiyenin
     * önizlemesi). Katıldı ve çıkarıldı satırları her şantiyeye birden düşer; sayılsalardı bütün şantiyeler aynı
     * anda listenin başına zıplar, her satırın önizlemesi aynı cümle olurdu.
     */
    @Transactional(readOnly = true)
    public Map<UUID, SiteEventView> creationBySite(Collection<UUID> siteIds) {
        Map<UUID, SiteEventView> creation = new HashMap<>();
        views(events.findCreationOf(siteIds)).forEach(event -> creation.putIfAbsent(event.siteId(), event));
        return creation;
    }

    private List<SiteEventView> views(List<SiteEvent> rows) {
        List<UUID> ids = rows.stream()
            .flatMap(event -> Stream.of(event.getActorId(), event.getSubjectId()))
            .filter(Objects::nonNull)
            .distinct()
            .toList();
        Map<UUID, String> names = users.findAllById(ids).stream()
            .collect(Collectors.toMap(AppUser::getId, AppUser::getFullName));
        return rows.stream().map(event -> toView(event, names::get)).toList();
    }

    private static SiteEventView toView(SiteEvent event, Function<UUID, String> nameOf) {
        UUID actor = event.getActorId();
        UUID subject = event.getSubjectId();
        return new SiteEventView(event.getId(), event.getSiteId(), event.getKind(), actor,
            actor == null ? null : nameOf.apply(actor), subject, subject == null ? null : nameOf.apply(subject),
            event.getCreatedAt());
    }
}
