package com.atalay.santiye.post;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.common.error.ApiException;
import com.atalay.santiye.post.dto.PostView;
import com.atalay.santiye.site.Site;
import com.atalay.santiye.site.SiteAccess;
import java.time.Clock;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Sohbetteki yoklama mesajı (TASARIM.md "Yoklama"): WhatsApp'taki anket gibi kişinin attığı, düz yazı olmayan
 * bir mesaj. Baloncuğunda "Yoklamaya Katıl" düğmesi çizilir. Bir şantiyede günde bir tane olur: ikinci kez
 * istenirse yenisi atılmaz, bugünkü döner (arayüz sohbette ona gider). "Bugün" şantiyenin saatine göredir.
 */
@Service
public class RollCallPosts {

    private final PostRepository posts;
    private final VisiblePosts visible;
    private final SiteAccess siteAccess;
    private final PostViews views;
    private final Clock clock;

    RollCallPosts(PostRepository posts, VisiblePosts visible, SiteAccess siteAccess, PostViews views, Clock clock) {
        this.posts = posts;
        this.visible = visible;
        this.siteAccess = siteAccess;
        this.views = views;
        this.clock = clock;
    }

    /** Şantiyeyi gören herkes atar; pratikte sabah şef atar. */
    @Transactional
    public PostView openToday(CurrentUser user, UUID siteId) {
        Site site = siteAccess.requireVisible(user, siteId);
        LocalDate today = LocalDate.now(clock);
        Post post = posts.findBySiteIdAndRollCallDayAndDeletedAtIsNull(site.getId(), today)
            .orElseGet(() -> posts.save(Post.rollCall(draft(user, site), today, clock.instant())));
        return views.of(post);
    }

    /** Görebildiği şantiyenin silinmemiş yoklama mesajı; değilse "bulunamadı". */
    @Transactional(readOnly = true)
    public RollCallMessage require(CurrentUser user, UUID postId) {
        Post post = visible.require(user, postId).post();
        if (!post.isRollCall() || post.isDeleted()) {
            throw ApiException.notFound("Yoklama mesajı bulunamadı.");
        }
        return new RollCallMessage(post.getId(), post.getSiteId(), post.getRollCallDay());
    }

    /** Firmada yoklama mesajı atılmış günler: o gün kaydı olmayan kişi "katılmadı" sayılır. */
    @Transactional(readOnly = true)
    public List<LocalDate> rollCallDays(UUID companyId, LocalDate from, LocalDate to) {
        return posts.findRollCallDays(companyId, from, to);
    }

    private static NewPost draft(CurrentUser user, Site site) {
        return new NewPost(UUID.randomUUID(), user.companyId(), site.getId(), user.userId(), null, false, null,
            false, false);
    }
}
