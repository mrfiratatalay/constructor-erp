package com.atalay.santiye.post;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.common.error.ApiException;
import com.atalay.santiye.post.dto.PostView;
import java.time.Clock;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Sorunlar: açık olanlar çözülene kadar listede kalır; patron da şantiye sorumlusu da çözebilir. */
@Service
public class IssueService {

    /** Çözülenlerin tamamı değil, son çözülenler gösterilir. */
    private static final int RECENTLY_RESOLVED = 50;

    private final PostRepository posts;
    private final VisiblePosts visible;
    private final PostViews views;
    private final Clock clock;

    IssueService(PostRepository posts, VisiblePosts visible, PostViews views, Clock clock) {
        this.posts = posts;
        this.visible = visible;
        this.views = views;
        this.clock = clock;
    }

    @Transactional(readOnly = true)
    public List<PostView> listIssues(CurrentUser user, boolean open, UUID siteId) {
        List<UUID> siteIds = visible.siteIds(user, siteId);
        if (siteIds.isEmpty()) {
            return List.of();
        }
        List<Post> found = open
            ? posts.findOpenIssues(siteIds)
            : posts.findResolvedIssues(siteIds, PageRequest.of(0, RECENTLY_RESOLVED));
        return views.of(found);
    }

    @Transactional
    public PostView resolveIssue(CurrentUser user, UUID postId, String note) {
        Post post = visible.require(user, postId).post();
        if (!post.isOpenIssue()) {
            throw ApiException.conflict("Bu sorun zaten çözülmüş ya da gönderi bir sorun değil.");
        }
        String trimmed = note == null || note.isBlank() ? null : note.trim();
        post.resolve(user.userId(), trimmed, clock.instant());
        return views.of(post);
    }
}
