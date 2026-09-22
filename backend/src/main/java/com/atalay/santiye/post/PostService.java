package com.atalay.santiye.post;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.common.error.ApiException;
import com.atalay.santiye.media.MediaIntake;
import com.atalay.santiye.media.MediaOwner;
import com.atalay.santiye.post.dto.CreatePostForm;
import com.atalay.santiye.post.dto.PostView;
import com.atalay.santiye.site.Site;
import com.atalay.santiye.site.SiteAccess;
import java.time.Clock;
import java.util.List;
import java.util.Optional;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
public class PostService {

    private final PostRepository posts;
    private final SiteAccess siteAccess;
    private final MediaIntake mediaIntake;
    private final PostViews views;
    private final ApplicationEventPublisher events;
    private final Clock clock;

    PostService(PostRepository posts, SiteAccess siteAccess, MediaIntake mediaIntake, PostViews views,
        ApplicationEventPublisher events, Clock clock) {
        this.posts = posts;
        this.siteAccess = siteAccess;
        this.mediaIntake = mediaIntake;
        this.views = views;
        this.events = events;
        this.clock = clock;
    }

    /**
     * Kişi yalnızca görebildiği şantiyeye gönderir. Aynı kimlikle ikinci kez gelen gönderi (internet koptu,
     * telefon tekrar denedi) yeni kayıt açmaz; ilk kayıt döner.
     */
    @Transactional
    public PostView createPost(CurrentUser author, CreatePostForm form) {
        Site site = siteAccess.requireVisible(author, form.siteId());
        Optional<Post> existing = posts.findById(form.id());
        if (existing.isPresent()) {
            return views.of(requireSameAuthor(existing.get(), author));
        }
        List<MultipartFile> files = form.files() == null ? List.of() : form.files();
        String body = form.body() == null || form.body().isBlank() ? null : form.body().trim();
        if (body == null && files.isEmpty()) {
            throw ApiException.badRequest("Boş gönderi gönderilemez: fotoğraf, video, ses ya da yazı ekle.");
        }
        var draft = new NewPost(form.id(), author.companyId(), form.siteId(), author.userId(), body, form.issue());
        Post post = posts.save(new Post(draft, clock.instant()));
        mediaIntake.accept(new MediaOwner(post.getId(), post.getSiteId(), post.getCompanyId()), files);
        announceIfIssue(post, site, author);
        return views.of(post);
    }

    private void announceIfIssue(Post post, Site site, CurrentUser author) {
        if (post.isIssue()) {
            events.publishEvent(IssueReported.of(post, site, author));
        }
    }

    private static Post requireSameAuthor(Post post, CurrentUser author) {
        if (!post.getAuthorId().equals(author.userId())) {
            throw ApiException.conflict("Bu gönderi kimliği başka bir gönderiye ait.");
        }
        return post;
    }
}
