package com.atalay.santiye.site;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.site.dto.SiteEventView;
import com.atalay.santiye.user.AppUser;
import com.atalay.santiye.user.UserRepository;
import java.time.Clock;
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

/** Şantiyenin sistem satırları: kuruldu, kişi eklendi, kişi çıkarıldı. Akışta olduğu anın yerinde durur. */
@Service
public class SiteEvents {

    private final SiteEventRepository events;
    private final UserRepository users;
    private final SiteAccess siteAccess;
    private final Clock clock;

    SiteEvents(SiteEventRepository events, UserRepository users, SiteAccess siteAccess, Clock clock) {
        this.events = events;
        this.users = users;
        this.siteAccess = siteAccess;
        this.clock = clock;
    }

    void record(UUID siteId, SiteEventKind kind, UUID actorId, UUID subjectId) {
        events.save(new SiteEvent(siteId, kind, actorId, subjectId, clock.instant()));
    }

    @Transactional(readOnly = true)
    public List<SiteEventView> list(CurrentUser user, UUID siteId) {
        siteAccess.requireVisible(user, siteId);
        return views(events.findBySite(siteId));
    }

    /** Şantiye başına en son olay; aynı anda birkaç olay varsa biri seçilir. */
    @Transactional(readOnly = true)
    public Map<UUID, SiteEventView> latestBySite(Collection<UUID> siteIds) {
        Map<UUID, SiteEventView> latest = new HashMap<>();
        views(events.findLatestPerSite(siteIds)).forEach(event -> latest.putIfAbsent(event.siteId(), event));
        return latest;
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
