package com.atalay.santiye.media;

import java.util.UUID;

/** Medyanın bağlı olduğu gönderi, şantiye ve firma. */
public record MediaOwner(UUID postId, UUID siteId, UUID companyId) {
}
