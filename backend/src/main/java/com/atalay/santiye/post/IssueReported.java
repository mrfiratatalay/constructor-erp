package com.atalay.santiye.post;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.site.Site;
import java.util.UUID;

/**
 * Sahadan yeni bir sorun bildirildi ya da bir gönderi sonradan "sorun" işaretlendi; kayıt kesinleşince
 * yayınlanır (bildirimler bunu dinler).
 */
public record IssueReported(
    UUID postId, UUID companyId, UUID siteId, String siteName, UUID authorId, String authorName, String body) {

    static IssueReported of(Post post, Site site, CurrentUser author) {
        return new IssueReported(post.getId(), post.getCompanyId(), site.getId(), site.getName(),
            author.userId(), author.fullName(), post.getBody());
    }
}
