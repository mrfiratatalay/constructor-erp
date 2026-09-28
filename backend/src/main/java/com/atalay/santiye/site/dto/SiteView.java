package com.atalay.santiye.site.dto;

import com.atalay.santiye.site.SiteStatus;
import jakarta.annotation.Nullable;
import java.util.List;
import java.util.UUID;

/**
 * Katılımcılar (ekranda "Katılımcılar") firmanın bütün aktif kişileridir, her şantiyede aynı: owners patronlar,
 * leads şefler, storekeepers depo sorumluları, workers çalışanlar. photoUrl ve photoThumbnailUrl: patronun koyduğu
 * şantiye fotoğrafı; yoksa boş. Fotoğraf yeni yüklendiyse işlenene kadar birkaç saniye açılmayabilir.
 */
public record SiteView(
    UUID id,
    String name,
    @Nullable String address,
    SiteStatus status,
    List<SiteLead> leads,
    List<SiteLead> owners,
    List<SiteLead> storekeepers,
    List<SiteLead> workers,
    @Nullable String photoUrl,
    @Nullable String photoThumbnailUrl) {
}
