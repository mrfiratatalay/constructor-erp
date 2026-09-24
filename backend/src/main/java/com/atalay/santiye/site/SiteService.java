package com.atalay.santiye.site;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.common.error.ApiException;
import com.atalay.santiye.site.dto.CreateSiteRequest;
import com.atalay.santiye.site.dto.SiteView;
import com.atalay.santiye.site.dto.UpdateSiteRequest;
import com.atalay.santiye.user.AppUser;
import com.atalay.santiye.user.UserRepository;
import java.time.Clock;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SiteService {

    private final SiteRepository sites;
    private final SiteAccess access;
    private final SiteViews views;
    private final SiteMembershipService memberships;
    private final SiteEvents events;
    private final UserRepository users;
    private final Clock clock;

    SiteService(SiteRepository sites, SiteAccess access, SiteViews views, SiteMembershipService memberships,
        SiteEvents events, UserRepository users, Clock clock) {
        this.sites = sites;
        this.access = access;
        this.views = views;
        this.memberships = memberships;
        this.events = events;
        this.users = users;
        this.clock = clock;
    }

    @Transactional(readOnly = true)
    public List<SiteView> listSites(CurrentUser user) {
        return views.of(access.visibleSites(user));
    }

    @Transactional(readOnly = true)
    public SiteView getSite(CurrentUser user, UUID siteId) {
        return views.of(access.requireVisible(user, siteId));
    }

    /** Şantiye kurmak grup kurmaktır: kuruldu satırı ve seçilen katılımcılar akışın başına yazılır. */
    @Transactional
    public SiteView createSite(CurrentUser owner, CreateSiteRequest request) {
        List<UUID> memberIds = activeMembers(owner, request.memberIds());
        Site site = new Site(owner.companyId(), request.name().trim(), blankToNull(request.address()), clock.instant());
        sites.save(site);
        events.record(site.getId(), SiteEventKind.CREATED, owner.userId(), null);
        memberships.addToNewSite(site.getId(), memberIds, owner.userId());
        return views.of(site);
    }

    @Transactional
    public SiteView updateSite(CurrentUser owner, UUID siteId, UpdateSiteRequest request) {
        Site site = sites.findByIdAndCompanyId(siteId, owner.companyId())
            .orElseThrow(() -> ApiException.notFound("Şantiye bulunamadı."));
        site.update(request.name().trim(), blankToNull(request.address()), request.status());
        return views.of(site);
    }

    /** Katılımcı yalnızca firmanın aktif bir kişisi olabilir. */
    private List<UUID> activeMembers(CurrentUser owner, List<UUID> requested) {
        if (requested == null || requested.isEmpty()) {
            return List.of();
        }
        List<UUID> unique = requested.stream().distinct().toList();
        long valid = users.findAllById(unique).stream()
            .filter(user -> user.getCompanyId().equals(owner.companyId()))
            .filter(AppUser::isActive)
            .count();
        if (valid != unique.size()) {
            throw ApiException.badRequest("Seçilen katılımcılardan biri bulunamadı.");
        }
        return unique;
    }

    private static String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
