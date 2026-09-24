package com.atalay.santiye.site;

import com.atalay.santiye.common.error.ApiException;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Kimin hangi şantiyenin katılımcısı olduğu. Her değişiklik akışa sistem satırı olarak düşer
 * ("Patron, Musa'yı ekledi"); ekip formundan da şantiye bilgisinden de aynı yoldan geçer.
 */
@Service
public class SiteMembershipService {

    private final SiteRepository sites;
    private final SiteMemberRepository members;
    private final SiteEvents events;

    SiteMembershipService(SiteRepository sites, SiteMemberRepository members, SiteEvents events) {
        this.sites = sites;
        this.members = members;
        this.events = events;
    }

    /** Kişinin şantiyelerini verilen listeyle değiştirir; başka firmanın şantiyesi kabul edilmez. */
    @Transactional
    public void assign(UUID companyId, UUID userId, Collection<UUID> siteIds, UUID actorId) {
        List<UUID> unique = siteIds.stream().distinct().toList();
        if (sites.countByCompanyIdAndIdIn(companyId, unique) != unique.size()) {
            throw ApiException.badRequest("Seçilen şantiyelerden biri bulunamadı.");
        }
        List<UUID> before = members.findSiteIdsByUserId(userId);
        members.deleteByUserId(userId);
        members.saveAll(unique.stream().map(siteId -> new SiteMember(siteId, userId)).toList());
        unique.stream().filter(siteId -> !before.contains(siteId))
            .forEach(siteId -> events.record(siteId, SiteEventKind.MEMBER_ADDED, actorId, userId));
        before.stream().filter(siteId -> !unique.contains(siteId))
            .forEach(siteId -> events.record(siteId, SiteEventKind.MEMBER_REMOVED, actorId, userId));
    }

    /** Yeni kurulan şantiyenin katılımcıları (WhatsApp'ta grubu kurarken seçilen kişiler). */
    @Transactional
    public void addToNewSite(UUID siteId, Collection<UUID> userIds, UUID actorId) {
        List<UUID> unique = userIds.stream().distinct().toList();
        members.saveAll(unique.stream().map(userId -> new SiteMember(siteId, userId)).toList());
        unique.forEach(userId -> events.record(siteId, SiteEventKind.MEMBER_ADDED, actorId, userId));
    }

    @Transactional(readOnly = true)
    public Map<UUID, List<UUID>> siteIdsByUser(Collection<UUID> userIds) {
        return members.findByUserIds(userIds).stream()
            .collect(Collectors.groupingBy(SiteMember::userId, Collectors.mapping(SiteMember::siteId, Collectors.toList())));
    }

    @Transactional(readOnly = true)
    public Map<UUID, List<UUID>> userIdsBySite(Collection<UUID> siteIds) {
        return members.findBySiteIds(siteIds).stream()
            .collect(Collectors.groupingBy(SiteMember::siteId, Collectors.mapping(SiteMember::userId, Collectors.toList())));
    }
}
