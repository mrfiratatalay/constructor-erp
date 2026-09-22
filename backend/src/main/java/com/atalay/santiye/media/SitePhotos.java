package com.atalay.santiye.media;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.media.dto.MediaView;
import com.atalay.santiye.site.SiteAccess;
import java.time.Clock;
import java.time.Duration;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Şantiyenin son bir haftalık fotoğrafları: masaüstü şantiye sayfasının sağ sütunu. */
@Service
public class SitePhotos {

    private static final Duration WINDOW = Duration.ofDays(7);
    /** Sağ sütunda dört sıra altılı ızgara; fazlası akışta. */
    private static final int LIMIT = 24;

    private final MediaRepository media;
    private final SiteAccess siteAccess;
    private final Clock clock;

    SitePhotos(MediaRepository media, SiteAccess siteAccess, Clock clock) {
        this.media = media;
        this.siteAccess = siteAccess;
        this.clock = clock;
    }

    @Transactional(readOnly = true)
    public List<MediaView> recent(CurrentUser user, UUID siteId) {
        siteAccess.requireVisible(user, siteId);
        return media.findReadyPhotosSince(List.of(siteId), clock.instant().minus(WINDOW)).stream()
            .limit(LIMIT)
            .map(MediaViews::toView)
            .toList();
    }
}
