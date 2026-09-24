package com.atalay.santiye.today.dto;

import com.atalay.santiye.post.dto.PostView;
import com.atalay.santiye.site.dto.SiteEventView;
import com.atalay.santiye.site.dto.SiteLead;
import jakarta.annotation.Nullable;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

/**
 * Bir şantiyenin ana ekrandaki satırı (WhatsApp'ın sohbet listesindeki satır).
 * latestPost: önizleme metni için son gönderi. latestEvent: son sistem satırı; hiç gönderisi olmayan şantiyenin
 * önizlemesi ("Patron, Musa'yı ekledi"). unreadPosts: kişinin son bakışından sonra başkalarının gönderdikleri.
 * pinnedAt: kişi şantiyeyi sabitlediyse ne zaman. photoThumbnailUrl: satırın solundaki şantiye fotoğrafı.
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
    List<String> recentPhotoUrls,
    @Nullable SiteEventView latestEvent,
    @Nullable Instant pinnedAt,
    @Nullable String photoThumbnailUrl) {
}
