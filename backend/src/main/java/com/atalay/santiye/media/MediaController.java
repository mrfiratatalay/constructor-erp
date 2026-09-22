package com.atalay.santiye.media;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.common.error.ApiException;
import com.atalay.santiye.site.SiteAccess;
import io.swagger.v3.oas.annotations.Hidden;
import java.time.Duration;
import java.util.UUID;
import org.springframework.core.io.Resource;
import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Dosyaları yetki kontrolüyle sunar. Frontend bu adresleri <img>/<video>/<audio> ile kullanır, JavaScript'le
 * çağırmaz; bu yüzden API dokümanında (ve Orval'ın ürettiği kodda) yer almaz. Video atlatma için gereken
 * "Range" istekleri Spring tarafından kendiliğinden karşılanır.
 */
@Hidden
@RestController
@RequestMapping("/media")
class MediaController {

    /** Bir medyanın içeriği hiç değişmez: tarayıcı bir kez indirir, bir daha sormaz. */
    private static final CacheControl FOREVER_PRIVATE = CacheControl.maxAge(Duration.ofDays(365)).cachePrivate().immutable();

    private final MediaRepository media;
    private final MediaStorage storage;
    private final SiteAccess siteAccess;

    MediaController(MediaRepository media, MediaStorage storage, SiteAccess siteAccess) {
        this.media = media;
        this.storage = storage;
        this.siteAccess = siteAccess;
    }

    @GetMapping("/{mediaId}")
    ResponseEntity<Resource> getMediaFile(@AuthenticationPrincipal CurrentUser user, @PathVariable UUID mediaId) {
        Media item = readable(user, mediaId);
        return file(storage.displayResource(item), item.getKind().displayContentType());
    }

    @GetMapping("/{mediaId}/thumbnail")
    ResponseEntity<Resource> getMediaThumbnail(@AuthenticationPrincipal CurrentUser user, @PathVariable UUID mediaId) {
        Media item = readable(user, mediaId);
        if (!item.getKind().hasThumbnail()) {
            throw ApiException.notFound("Önizleme yok.");
        }
        return file(storage.thumbnailResource(item), MediaType.IMAGE_JPEG_VALUE);
    }

    /** Başka firmanın ya da görülemeyen şantiyenin dosyası "bulunamadı" döner. */
    private Media readable(CurrentUser user, UUID mediaId) {
        Media item = media.findById(mediaId)
            .filter(candidate -> candidate.getCompanyId().equals(user.companyId()))
            .filter(candidate -> candidate.getStatus() == MediaStatus.READY)
            .orElseThrow(() -> ApiException.notFound("Dosya bulunamadı."));
        siteAccess.requireVisible(user, item.getSiteId());
        return item;
    }

    private static ResponseEntity<Resource> file(Resource resource, String contentType) {
        return ResponseEntity.ok()
            .contentType(MediaType.parseMediaType(contentType))
            .cacheControl(FOREVER_PRIVATE)
            .body(resource);
    }
}
