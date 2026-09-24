package com.atalay.santiye.site.dto;

import com.atalay.santiye.site.SiteStatus;
import jakarta.annotation.Nullable;
import java.util.List;
import java.util.UUID;

/**
 * Katılımcılar (ekranda "Katılımcılar") firmanın bütün aktif kişileridir, her şantiyede aynı: leads şefler,
 * owners patronlar. photoUrl ve photoThumbnailUrl: patronun koyduğu şantiye fotoğrafı; yoksa boş. Fotoğraf yeni
 * yüklendiyse işlenene kadar birkaç saniye açılmayabilir.
 */
public record SiteView(
    UUID id,
    String name,
    @Nullable String address,
    SiteStatus status,
    List<SiteLead> leads,
    List<SiteLead> owners,
    @Nullable String photoUrl,
    @Nullable String photoThumbnailUrl) {
}
