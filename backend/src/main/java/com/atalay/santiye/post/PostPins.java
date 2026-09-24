package com.atalay.santiye.post;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.common.error.ApiException;
import com.atalay.santiye.post.dto.PostView;
import java.time.Clock;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Mesaj sabitleme (WhatsApp gibi): şantiyeyi gören herkes sabitler ve kaldırır. Sabit mesaj akışın üstünde
 * şerit olarak durur, ta ki biri kaldırana kadar; şantiye başına en fazla üç.
 */
@Service
public class PostPins {

    private static final int MAX_PINS = 3;

    private final PostRepository posts;
    private final VisiblePosts visible;
    private final PostViews views;
    private final Clock clock;

    PostPins(PostRepository posts, VisiblePosts visible, PostViews views, Clock clock) {
        this.posts = posts;
        this.visible = visible;
        this.views = views;
        this.clock = clock;
    }

    @Transactional
    public PostView pin(CurrentUser user, UUID postId) {
        Post post = visible.require(user, postId).post();
        if (post.isDeleted()) {
            throw ApiException.conflict("Silinmiş mesaj sabitlenemez.");
        }
        if (!post.isPinned() && posts.findPinned(post.getSiteId()).size() >= MAX_PINS) {
            throw ApiException.conflict("Bir şantiyede en fazla " + MAX_PINS + " mesaj sabitlenebilir.");
        }
        post.pin(user.userId(), clock.instant());
        return views.of(post);
    }

    @Transactional
    public PostView unpin(CurrentUser user, UUID postId) {
        Post post = visible.require(user, postId).post();
        post.unpin();
        return views.of(post);
    }

    @Transactional(readOnly = true)
    public List<PostView> pinned(CurrentUser user, UUID siteId) {
        UUID visibleSite = visible.siteIds(user, siteId).getFirst();
        return views.of(posts.findPinned(visibleSite));
    }
}
