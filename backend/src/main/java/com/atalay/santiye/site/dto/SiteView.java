package com.atalay.santiye.site.dto;

import com.atalay.santiye.site.SiteStatus;
import jakarta.annotation.Nullable;
import java.util.List;
import java.util.UUID;

/**
 * leads: şantiyenin katılımcıları (ekranda "Katılımcılar"). photoUrl ve photoThumbnailUrl: patronun koyduğu
 * şantiye fotoğrafı; yoksa boş. Fotoğraf yeni yüklendiyse işlenene kadar birkaç saniye açılmayabilir.
 */
public record SiteView(
    UUID id,
    String name,
    @Nullable String address,
    SiteStatus status,
    List<SiteLead> leads,
    @Nullable String photoUrl,
    @Nullable String photoThumbnailUrl) {
}
