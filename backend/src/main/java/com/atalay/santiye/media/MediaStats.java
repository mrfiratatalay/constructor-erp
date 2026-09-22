package com.atalay.santiye.media;

import com.atalay.santiye.common.persistence.SiteCounts;
import java.time.Instant;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Bugün paneli için şantiye başına fotoğraf sayısı ve günün son fotoğrafı. */
@Service
public class MediaStats {

    private final MediaRepository media;

    MediaStats(MediaRepository media) {
        this.media = media;
    }

    @Transactional(readOnly = true)
    public Map<UUID, Long> photosSince(Collection<UUID> siteIds, Instant since) {
        return SiteCounts.toMap(media.countPhotosSince(siteIds, since));
    }

    /** Şantiye başına bugünün en yeni fotoğrafının önizleme adresi. */
    @Transactional(readOnly = true)
    public Map<UUID, String> latestPhotoThumbnails(Collection<UUID> siteIds, Instant since) {
        Map<UUID, String> latest = new HashMap<>();
        for (Media photo : media.findReadyPhotosSince(siteIds, since)) {
            latest.putIfAbsent(photo.getSiteId(), "/api/media/" + photo.getId() + "/thumbnail");
        }
        return latest;
    }
}
