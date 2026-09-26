package com.atalay.santiye.media;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.common.error.ApiException;
import com.atalay.santiye.site.Site;
import com.atalay.santiye.site.SiteRepository;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

/**
 * Şantiyenin fotoğrafı, WhatsApp'taki grup fotoğrafı gibi: listede satırın solunda, bilgi ekranının en
 * üstünde durur. Firmadaki herkes koyar ya da kaldırır; yenisi gelince eskisinin dosyası silinir.
 */
@Service
public class SiteCoverPhotos {

    private final SiteRepository sites;
    private final MediaIntake intake;
    private final MediaRemoval removal;

    SiteCoverPhotos(SiteRepository sites, MediaIntake intake, MediaRemoval removal) {
        this.sites = sites;
        this.intake = intake;
        this.removal = removal;
    }

    @Transactional
    public void change(CurrentUser user, UUID siteId, MultipartFile file) {
        Site site = companySite(user, siteId);
        UUID previous = site.getPhotoMediaId();
        site.changePhoto(intake.acceptSitePhoto(site.getId(), site.getCompanyId(), file));
        removeIfPresent(previous);
    }

    @Transactional
    public void clear(CurrentUser user, UUID siteId) {
        Site site = companySite(user, siteId);
        UUID previous = site.getPhotoMediaId();
        site.changePhoto(null);
        removeIfPresent(previous);
    }

    private Site companySite(CurrentUser user, UUID siteId) {
        return sites.findByIdAndCompanyId(siteId, user.companyId())
            .orElseThrow(() -> ApiException.notFound("Şantiye bulunamadı."));
    }

    private void removeIfPresent(UUID mediaId) {
        if (mediaId != null) {
            removal.remove(mediaId);
        }
    }
}
