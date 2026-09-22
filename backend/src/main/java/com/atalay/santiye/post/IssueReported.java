package com.atalay.santiye.post;

import java.util.UUID;

/** Sahadan yeni bir sorun bildirildi; kayıt kesinleşince yayınlanır (bildirimler bunu dinler). */
public record IssueReported(
    UUID postId, UUID companyId, UUID siteId, String siteName, UUID authorId, String authorName, String body) {
}
