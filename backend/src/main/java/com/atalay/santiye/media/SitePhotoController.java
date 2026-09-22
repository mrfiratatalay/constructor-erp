package com.atalay.santiye.media;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.media.dto.MediaView;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import java.util.UUID;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "Photos")
public class SitePhotoController {

    private final SitePhotos photos;

    SitePhotoController(SitePhotos photos) {
        this.photos = photos;
    }

    /** Son yedi günün fotoğrafları, en yeniden eskiye (en çok 24). */
    @GetMapping("/sites/{siteId}/photos")
    public List<MediaView> listSitePhotos(@AuthenticationPrincipal CurrentUser user, @PathVariable UUID siteId) {
        return photos.recent(user, siteId);
    }
}
