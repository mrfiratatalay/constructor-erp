package com.atalay.santiye.site;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.common.error.ApiException;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Görünürlük kuralının tek sahibi: patron firmanın bütün şantiyelerini, şantiye sorumlusu
 * yalnızca kendisine atananları görür. Gönderi, sorun ve Bugün paneli de bu kuralı buradan kullanır.
 */
@Service
public class SiteAccess {

    private final SiteRepository sites;
    private final SiteMemberRepository members;

    SiteAccess(SiteRepository sites, SiteMemberRepository members) {
        this.sites = sites;
        this.members = members;
    }

    @Transactional(readOnly = true)
    public List<Site> visibleSites(CurrentUser user) {
        if (user.isOwner()) {
            return sites.findByCompanyIdOrderByName(user.companyId());
        }
        return sites.findByCompanyIdAndIdInOrderByName(user.companyId(), members.findSiteIdsByUserId(user.userId()));
    }

    /** Görünmeyen şantiye "bulunamadı" döner: başka şantiyenin varlığı bile belli edilmez. */
    @Transactional(readOnly = true)
    public Site requireVisible(CurrentUser user, UUID siteId) {
        return visibleSites(user).stream()
            .filter(site -> site.getId().equals(siteId))
            .findFirst()
            .orElseThrow(() -> ApiException.notFound("Şantiye bulunamadı."));
    }
}
