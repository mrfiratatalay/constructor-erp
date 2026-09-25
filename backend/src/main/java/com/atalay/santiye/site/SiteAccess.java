package com.atalay.santiye.site;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.common.error.ApiException;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Görünürlük kuralının tek sahibi: firmadaki herkes firmanın bütün şantiyelerini görür ve hepsine yazar
 * (herkes her gruptadır). Başka firmanın şantiyesi görünmez. Gönderi, arama ve ana ekran bu kuralı buradan kullanır.
 */
@Service
public class SiteAccess {

    private final SiteRepository sites;

    SiteAccess(SiteRepository sites) {
        this.sites = sites;
    }

    @Transactional(readOnly = true)
    public List<Site> visibleSites(CurrentUser user) {
        return sites.findByCompanyIdOrderByName(user.companyId());
    }

    /** Görünmeyen şantiye "bulunamadı" döner: başka firmanın şantiyesinin varlığı bile belli edilmez. */
    @Transactional(readOnly = true)
    public Site requireVisible(CurrentUser user, UUID siteId) {
        return sites.findByIdAndCompanyId(siteId, user.companyId())
            .orElseThrow(() -> ApiException.notFound("Şantiye bulunamadı."));
    }
}
