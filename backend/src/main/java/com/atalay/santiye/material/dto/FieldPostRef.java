package com.atalay.santiye.material.dto;

import java.util.UUID;

/** Hareketin yansıdığı Saha gönderisi: hangi şantiyede. */
public record FieldPostRef(UUID postId, UUID siteId, String siteName) {
}
