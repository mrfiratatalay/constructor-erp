package com.atalay.santiye.media;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.media.dto.MediaView;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/** Şantiyenin medyası: galeri ("Medya ve belgeler") ve şantiyenin kendi fotoğrafı. */
@RestController
@Tag(name = "Library")
public class SiteMediaController {

    private final SiteLibrary library;
    private final SiteCoverPhotos coverPhotos;

    SiteMediaController(SiteLibrary library, SiteCoverPhotos coverPhotos) {
        this.library = library;
        this.coverPhotos = coverPhotos;
    }

    /** Hazır fotoğraf, video ve belgeler; en yeniden eskiye. */
    @GetMapping("/sites/{siteId}/library")
    public List<MediaView> listSiteLibrary(@AuthenticationPrincipal CurrentUser user, @PathVariable UUID siteId) {
        return library.list(user, siteId);
    }

    @PutMapping(value = "/sites/{siteId}/photo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('OWNER')")
    public void changeSitePhoto(@AuthenticationPrincipal CurrentUser owner, @PathVariable UUID siteId,
        @Valid @ModelAttribute SitePhotoForm form) {
        coverPhotos.change(owner, siteId, form.file());
    }

    @DeleteMapping("/sites/{siteId}/photo")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('OWNER')")
    public void clearSitePhoto(@AuthenticationPrincipal CurrentUser owner, @PathVariable UUID siteId) {
        coverPhotos.clear(owner, siteId);
    }
}
