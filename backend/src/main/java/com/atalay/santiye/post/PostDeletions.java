package com.atalay.santiye.post;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.common.error.ApiException;
import com.atalay.santiye.media.MediaRemoval;
import com.atalay.santiye.post.dto.PostView;
import java.time.Clock;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Gönderi silme. Yazar kendi gönderisini, patron her gönderiyi her zaman silebilir; ama defter iz bırakmadan
 * değişmez (TASARIM.md İlke 6): satır "silindi" izi olarak kalır, yazı ve medya gider. Açık sorunsa
 * Sorunlar'dan düşer.
 */
@Service
public class PostDeletions {

    private final VisiblePosts visible;
    private final PostViews views;
    private final MediaRemoval mediaRemoval;
    private final Clock clock;

    PostDeletions(VisiblePosts visible, PostViews views, MediaRemoval mediaRemoval, Clock clock) {
        this.visible = visible;
        this.views = views;
        this.mediaRemoval = mediaRemoval;
        this.clock = clock;
    }

    @Transactional
    public PostView delete(CurrentUser user, UUID postId) {
        Post post = visible.require(user, postId).post();
        if (!post.getAuthorId().equals(user.userId()) && !user.isOwner()) {
            throw ApiException.forbidden("Yalnızca kendi gönderini silebilirsin.");
        }
        if (post.isDeleted()) {
            throw ApiException.conflict("Bu gönderi zaten silinmiş.");
        }
        if (post.isDeliveryRecord()) {
            throw ApiException.conflict("İş teslimi silinmez: işin kanıtıdır.");
        }
        post.delete(user.userId(), clock.instant());
        mediaRemoval.removeForPost(post.getId());
        return views.of(post);
    }
}
