package com.atalay.santiye.media;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.media.dto.MediaView;
import com.atalay.santiye.site.SiteAccess;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * WhatsApp'taki "Medya, bağlantılar ve belgeler": şantiyenin bütün geçmişindeki fotoğraf, video ve belgeler.
 * "Geçen ayki döşeme fotoğrafı" buradan bulunur; ekran aylara göre ayırır.
 */
@Service
public class SiteLibrary {

    /** Bir şantiyenin birkaç yıllık fotoğrafı; ızgara bundan fazlasını zaten gösteremez. */
    private static final int LIMIT = 1000;

    private final MediaRepository media;
    private final SiteAccess siteAccess;

    SiteLibrary(MediaRepository media, SiteAccess siteAccess) {
        this.media = media;
        this.siteAccess = siteAccess;
    }

    @Transactional(readOnly = true)
    public List<MediaView> list(CurrentUser user, UUID siteId) {
        siteAccess.requireVisible(user, siteId);
        return media.findLibrary(siteId, PageRequest.of(0, LIMIT)).stream().map(MediaViews::toView).toList();
    }
}
