package com.atalay.santiye.media;

import com.atalay.santiye.media.dto.MediaView;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Gönderi ekranları için medya bilgisi; birçok gönderinin medyası tek sorguda gelir. */
@Service
public class MediaViews {

    private final MediaRepository media;

    MediaViews(MediaRepository media) {
        this.media = media;
    }

    @Transactional(readOnly = true)
    public Map<UUID, List<MediaView>> byPost(Collection<UUID> postIds) {
        return media.findByPostIdInOrderByPosition(postIds).stream()
            .collect(Collectors.groupingBy(Media::getPostId, Collectors.mapping(MediaViews::toView, Collectors.toList())));
    }

    /** İmalat girişlerinin dosyaları (Saha'ya yansıtılmış olsun olmasın). */
    @Transactional(readOnly = true)
    public Map<UUID, List<MediaView>> byProductionEntry(Collection<UUID> entryIds) {
        return media.findByProductionEntryIdInOrderByPosition(entryIds).stream()
            .collect(Collectors.groupingBy(Media::getProductionEntryId,
                Collectors.mapping(MediaViews::toView, Collectors.toList())));
    }

    static MediaView toView(Media item) {
        boolean ready = item.getStatus() == MediaStatus.READY;
        String base = "/api/media/" + item.getId();
        String url = ready ? base : null;
        String thumbnailUrl = ready && item.getKind().hasThumbnail() ? base + "/thumbnail" : null;
        return new MediaView(item.getId(), item.getKind(), item.getStatus(), item.getDurationSeconds(), url, thumbnailUrl,
            item.getFileName(), item.getSizeBytes(), item.getCreatedAt());
    }
}
