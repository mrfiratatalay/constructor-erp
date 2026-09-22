package com.atalay.santiye.today.dto;

import com.atalay.santiye.post.dto.PostView;
import com.atalay.santiye.site.dto.SiteLead;
import jakarta.annotation.Nullable;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

/**
 * Bir şantiyenin ana ekrandaki satırı.
 * latestPost: önizleme metni için son gönderi. unreadPosts: kişinin son bakışından sonra başkalarının
 * gönderdikleri. recentPhotoUrls: bugünün en yeni (en çok üç) fotoğrafı, photosToday ile "+N" hesaplanır.
 */
public record SiteToday(
    UUID siteId,
    String name,
    List<SiteLead> leads,
    @Nullable Instant lastPostAt,
    @Nullable PostView latestPost,
    long postsToday,
    long photosToday,
    long unreadPosts,
    long openIssues,
    @Nullable Instant oldestOpenIssueAt,
    boolean noNewsToday,
    List<String> recentPhotoUrls) {
}
