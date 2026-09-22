package com.atalay.santiye.media;

import com.atalay.santiye.common.persistence.SiteCounts;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Ana ekran için şantiye başına fotoğraf sayısı ve günün son fotoğrafları. */
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

    /** Şantiye başına bugünün en yeni fotoğraflarının önizleme adresleri, en yeniden eskiye. */
    @Transactional(readOnly = true)
    public Map<UUID, List<String>> recentPhotoThumbnails(Collection<UUID> siteIds, Instant since, int limit) {
        Map<UUID, List<String>> recent = new HashMap<>();
        for (Media photo : media.findReadyPhotosSince(siteIds, since)) {
            List<String> urls = recent.computeIfAbsent(photo.getSiteId(), siteId -> new ArrayList<>());
            if (urls.size() < limit) {
                urls.add("/api/media/" + photo.getId() + "/thumbnail");
            }
        }
        return recent;
    }
}
