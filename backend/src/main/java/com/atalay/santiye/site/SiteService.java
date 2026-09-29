package com.atalay.santiye.site;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.billing.PlanLimits;
import com.atalay.santiye.common.error.ApiException;
import com.atalay.santiye.site.dto.CreateSiteRequest;
import com.atalay.santiye.site.dto.SiteView;
import com.atalay.santiye.site.dto.UpdateSiteRequest;
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
    private final SiteEvents events;
    private final PlanLimits limits;
    private final Clock clock;

    SiteService(SiteRepository sites, SiteAccess access, SiteViews views, SiteEvents events, PlanLimits limits,
        Clock clock) {
        this.sites = sites;
        this.access = access;
        this.views = views;
        this.events = events;
        this.limits = limits;
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

    /**
     * Şantiye kurmak grup kurmaktır: firmadaki herkes kurar, akışın başına "Musa şantiyeyi kurdu" yazılır. Kişi
     * seçilmez: herkes içindedir.
     */
    @Transactional
    public SiteView createSite(CurrentUser creator, CreateSiteRequest request) {
        limits.requireSiteSlot(creator.companyId());
        Site site = new Site(creator.companyId(), request.name().trim(), blankToNull(request.address()), clock.instant());
        sites.save(site);
        events.record(site.getId(), SiteEventKind.CREATED, creator.userId(), null);
        return views.of(site);
    }

    @Transactional
    public SiteView updateSite(CurrentUser user, UUID siteId, UpdateSiteRequest request) {
        Site site = sites.findByIdAndCompanyId(siteId, user.companyId())
            .orElseThrow(() -> ApiException.notFound("Şantiye bulunamadı."));
        if (site.getStatus() != SiteStatus.ACTIVE && request.status() == SiteStatus.ACTIVE) {
            limits.requireSiteSlot(user.companyId());
        }
        site.update(request.name().trim(), blankToNull(request.address()), request.status());
        return views.of(site);
    }

    private static String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
