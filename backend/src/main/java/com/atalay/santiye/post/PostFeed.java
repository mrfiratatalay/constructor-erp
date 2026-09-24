package com.atalay.santiye.post;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.post.dto.PostPage;
import com.atalay.santiye.post.dto.PostView;
import java.util.List;
import java.util.UUID;
import java.util.function.Function;
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
        return page(limit, oneExtra -> cursor == null
            ? posts.findNewest(siteIds, oneExtra)
            : findOlder(siteIds, FeedCursor.decode(cursor), oneExtra));
    }

    /** Saha sekmesi: yalnızca şantiyenin saha güncellemeleri; sohbetle aynı imleç ve sayfa kuralı. */
    @Transactional(readOnly = true)
    public PostPage listFieldUpdates(CurrentUser user, UUID siteId, String cursor, int limit) {
        UUID visibleSite = visible.siteIds(user, siteId).getFirst();
        return page(limit, oneExtra -> cursor == null
            ? posts.findNewestFieldUpdates(visibleSite, oneExtra)
            : findOlderFieldUpdates(visibleSite, FeedCursor.decode(cursor), oneExtra));
    }

    @Transactional(readOnly = true)
    public PostView getPost(CurrentUser user, UUID postId) {
        return views.of(visible.require(user, postId).post());
    }

    /** Bir fazlası istenir: gelirse arkasında daha eskiler vardır ve imleç verilir. */
    private PostPage page(int limit, Function<PageRequest, List<Post>> query) {
        int size = Math.clamp(limit, 1, MAX_PAGE_SIZE);
        List<Post> rows = query.apply(PageRequest.of(0, size + 1));
        List<Post> page = rows.subList(0, Math.min(size, rows.size()));
        String next = rows.size() > size ? FeedCursor.of(page.getLast()).encode() : null;
        return new PostPage(views.of(page), next);
    }

    private List<Post> findOlder(List<UUID> siteIds, FeedCursor cursor, PageRequest page) {
        return posts.findOlderThan(siteIds, cursor.createdAt(), cursor.id(), page);
    }

    private List<Post> findOlderFieldUpdates(UUID siteId, FeedCursor cursor, PageRequest page) {
        return posts.findFieldUpdatesOlderThan(siteId, cursor.createdAt(), cursor.id(), page);
    }
}
