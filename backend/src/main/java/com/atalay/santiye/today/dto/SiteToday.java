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
 * latestPost: önizleme metni için son gönderi. latestEvent: listede sayılan sistem satırı, yani kuruluş; hiç
 * gönderisi olmayan şantiyenin önizlemesi ("Patron şantiyeyi kurdu"). Katıldı/çıkarıldı satırları her şantiyeye
 * birden düştüğü için listede sayılmaz. unreadPosts: kişinin son bakışından sonra başkalarının gönderdikleri.
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
