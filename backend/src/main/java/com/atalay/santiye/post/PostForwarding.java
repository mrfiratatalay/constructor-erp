package com.atalay.santiye.post;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.common.error.ApiException;
import com.atalay.santiye.media.MediaCopies;
import com.atalay.santiye.media.MediaOwner;
import com.atalay.santiye.post.dto.PostView;
import com.atalay.santiye.site.Site;
import com.atalay.santiye.site.SiteAccess;
import java.time.Clock;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * İlet (WhatsApp gibi): mesajın yazısı ve hazır dosyaları başka bir şantiyeye, iletenin adıyla yeni mesaj
 * olarak gider; üstünde "İletildi" yazar. Dosyalar kopyalanır: asıl mesaj silinse de kopya yerinde kalır.
 * Kopya düz mesajdır: başka şantiyenin saha güncellemesi, bu şantiyenin sahasında olmuş bir şey değildir.
 */
@Service
public class PostForwarding {

    private final PostRepository posts;
    private final VisiblePosts visible;
    private final SiteAccess siteAccess;
    private final MediaCopies mediaCopies;
    private final PostViews views;
    private final Clock clock;

    PostForwarding(PostRepository posts, VisiblePosts visible, SiteAccess siteAccess, MediaCopies mediaCopies,
        PostViews views, Clock clock) {
        this.posts = posts;
        this.visible = visible;
        this.siteAccess = siteAccess;
        this.mediaCopies = mediaCopies;
        this.views = views;
        this.clock = clock;
    }

    @Transactional
    public PostView forward(CurrentUser user, UUID postId, UUID targetSiteId) {
        Post source = visible.require(user, postId).post();
        if (source.isDeleted()) {
            throw ApiException.conflict("Silinmiş mesaj iletilemez.");
        }
        Site target = siteAccess.requireVisible(user, targetSiteId);
        var draft = new NewPost(UUID.randomUUID(), user.companyId(), target.getId(), user.userId(), source.getBody(),
            false, null, true, false);
        Post copy = posts.save(new Post(draft, clock.instant()));
        int copied = mediaCopies.copyPostMedia(source.getId(), new MediaOwner(copy.getId(), target.getId(), user.companyId()));
        if (copy.getBody() == null && copied == 0) {
            throw ApiException.conflict("Bu mesajın dosyaları henüz hazır değil; biraz sonra tekrar dene.");
        }
        return views.of(copy);
    }
}
