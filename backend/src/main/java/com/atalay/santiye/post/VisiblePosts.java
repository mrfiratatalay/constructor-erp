package com.atalay.santiye.post;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.common.error.ApiException;
import com.atalay.santiye.site.Site;
import com.atalay.santiye.site.SiteAccess;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Component;

/**
 * Gönderiler için görünürlük kuralı tek yerde: kişi yalnızca görebildiği şantiyelerin gönderilerine
 * erişir. Başka firmanın ya da görülemeyen şantiyenin gönderisi "bulunamadı" döner.
 */
@Component
class VisiblePosts {

    private final PostRepository posts;
    private final SiteAccess siteAccess;

    VisiblePosts(PostRepository posts, SiteAccess siteAccess) {
        this.posts = posts;
        this.siteAccess = siteAccess;
    }

    /** Görünür bir gönderi ve şantiyesi. */
    record VisiblePost(Post post, Site site) {
    }

    /** siteId verilirse yalnızca o şantiye (görünür değilse "bulunamadı"), verilmezse bütün görünenler. */
    List<UUID> siteIds(CurrentUser user, UUID siteId) {
        if (siteId != null) {
            return List.of(siteAccess.requireVisible(user, siteId).getId());
        }
        return siteAccess.visibleSites(user).stream().map(Site::getId).toList();
    }

    VisiblePost require(CurrentUser user, UUID postId) {
        Post post = posts.findById(postId)
            .filter(candidate -> candidate.getCompanyId().equals(user.companyId()))
            .orElseThrow(() -> ApiException.notFound("Gönderi bulunamadı."));
        return new VisiblePost(post, siteAccess.requireVisible(user, post.getSiteId()));
    }
}
