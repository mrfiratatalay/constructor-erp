package com.atalay.santiye.site;

import com.atalay.santiye.common.error.ApiException;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Kimin hangi şantiyeden sorumlu olduğu. Tek yönetim yeri ekip formudur. */
@Service
public class SiteMembershipService {

    private final SiteRepository sites;
    private final SiteMemberRepository members;

    SiteMembershipService(SiteRepository sites, SiteMemberRepository members) {
        this.sites = sites;
        this.members = members;
    }

    /** Kişinin şantiyelerini verilen listeyle değiştirir; başka firmanın şantiyesi kabul edilmez. */
    @Transactional
    public void assign(UUID companyId, UUID userId, Collection<UUID> siteIds) {
        List<UUID> unique = siteIds.stream().distinct().toList();
        if (sites.countByCompanyIdAndIdIn(companyId, unique) != unique.size()) {
            throw ApiException.badRequest("Seçilen şantiyelerden biri bulunamadı.");
        }
        members.deleteByUserId(userId);
        members.saveAll(unique.stream().map(siteId -> new SiteMember(siteId, userId)).toList());
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
