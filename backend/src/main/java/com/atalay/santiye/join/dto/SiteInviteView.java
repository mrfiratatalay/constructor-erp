package com.atalay.santiye.join.dto;

import java.util.UUID;

/** Bağlantıyı açan kişinin gördüğü: kim, hangi şantiyeye çağırıyor; zaten içerideyse doğrudan girer. */
public record SiteInviteView(UUID siteId, String siteName, String inviterName, boolean alreadyInside) {
}
