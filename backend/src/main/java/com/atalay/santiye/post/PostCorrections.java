package com.atalay.santiye.post;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.common.error.ApiException;
import com.atalay.santiye.post.VisiblePosts.VisiblePost;
import com.atalay.santiye.post.dto.CorrectPostRequest;
import com.atalay.santiye.post.dto.PostView;
import java.time.Clock;
import java.util.Objects;
import java.util.UUID;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Gönderi düzeltme: yalnızca yazar, yalnızca yazı ve "sorun" işareti; gönderide "düzenlendi" izi kalır.
 * Başkasının ağzından yazılmaz, bu yüzden patron da başkasının gönderisini düzeltemez (silebilir).
 * Sonradan "sorun" işaretlenen gönderi yeni bildirilmiş sorun gibi patrona haber verir.
 */
@Service
public class PostCorrections {

    private final VisiblePosts visible;
    private final PostViews views;
    private final ApplicationEventPublisher events;
    private final Clock clock;

    PostCorrections(VisiblePosts visible, PostViews views, ApplicationEventPublisher events, Clock clock) {
        this.visible = visible;
        this.views = views;
        this.events = events;
        this.clock = clock;
    }

    @Transactional
    public PostView correct(CurrentUser user, UUID postId, CorrectPostRequest request) {
        VisiblePost found = visible.require(user, postId);
        Post post = found.post();
        requireCorrectable(post, user);
        String body = request.body() == null || request.body().isBlank() ? null : request.body().trim();
        boolean becameIssue = request.issue() && !post.isIssue();
        if (Objects.equals(body, post.getBody()) && request.issue() == post.isIssue()) {
            return views.of(post);
        }
        requireChangeAllowed(post, body, request.issue());
        post.correct(body, request.issue(), clock.instant());
        if (becameIssue) {
            events.publishEvent(IssueReported.of(post, found.site(), user));
        }
        return views.of(post);
    }

    private static void requireCorrectable(Post post, CurrentUser user) {
        if (!post.getAuthorId().equals(user.userId())) {
            throw ApiException.forbidden("Yalnızca kendi gönderini düzeltebilirsin.");
        }
        if (post.isDeleted()) {
            throw ApiException.conflict("Silinmiş gönderi düzeltilemez.");
        }
    }

    /** Çözülmüş sorunun işareti değişmez; yazısı silinen gönderinin de fotoğrafı ya da sesi kalmalı. */
    private void requireChangeAllowed(Post post, String body, boolean issue) {
        if (post.getResolvedAt() != null && issue != post.isIssue()) {
            throw ApiException.conflict("Çözülmüş sorunun işareti değiştirilemez.");
        }
        if (body == null && views.of(post).media().isEmpty()) {
            throw ApiException.badRequest("Gönderi boş kalamaz: yazıyı silmek yerine gönderiyi sil.");
        }
    }
}
