package com.atalay.santiye.post;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.post.dto.PostPage;
import com.atalay.santiye.post.dto.PostView;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Akış: kişinin görebildiği şantiyelerin gönderileri, en yeniden eskiye. Silinenler iz olarak yerinde durur. */
@Service
public class PostFeed {

    private static final int MAX_PAGE_SIZE = 50;

    private final PostRepository posts;
    private final VisiblePosts visible;
    private final PostViews views;

    PostFeed(PostRepository posts, VisiblePosts visible, PostViews views) {
        this.posts = posts;
        this.visible = visible;
        this.views = views;
    }

    /** siteId boşsa bütün görünen şantiyeler; cursor boşsa en yenilerden başlar. */
    @Transactional(readOnly = true)
    public PostPage listPosts(CurrentUser user, UUID siteId, String cursor, int limit) {
        List<UUID> siteIds = visible.siteIds(user, siteId);
        if (siteIds.isEmpty()) {
            return new PostPage(List.of(), null);
        }
        int size = Math.clamp(limit, 1, MAX_PAGE_SIZE);
        PageRequest oneExtra = PageRequest.of(0, size + 1);
        List<Post> rows = cursor == null
            ? posts.findNewest(siteIds, oneExtra)
            : findOlder(siteIds, FeedCursor.decode(cursor), oneExtra);
        List<Post> page = rows.subList(0, Math.min(size, rows.size()));
        String next = rows.size() > size ? FeedCursor.of(page.getLast()).encode() : null;
        return new PostPage(views.of(page), next);
    }

    @Transactional(readOnly = true)
    public PostView getPost(CurrentUser user, UUID postId) {
        return views.of(visible.require(user, postId).post());
    }

    private List<Post> findOlder(List<UUID> siteIds, FeedCursor cursor, PageRequest page) {
        return posts.findOlderThan(siteIds, cursor.createdAt(), cursor.id(), page);
    }
}
