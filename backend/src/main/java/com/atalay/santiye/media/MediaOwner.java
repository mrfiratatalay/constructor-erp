package com.atalay.santiye.media;

import java.util.UUID;

/**
 * Medyanın bağlı olduğu gönderi, şantiye ve firma. productionEntryId: imalatın günlük girişinin dosyası; giriş
 * Saha'ya yansıtılmadıysa gönderisi yoktur (postId boş).
 */
public record MediaOwner(UUID postId, UUID siteId, UUID companyId, UUID productionEntryId) {

    public MediaOwner(UUID postId, UUID siteId, UUID companyId) {
        this(postId, siteId, companyId, null);
    }
}
