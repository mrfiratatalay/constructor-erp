package com.atalay.santiye.post;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.media.MediaRemoval;
import java.time.Clock;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Başka bir özelliğin Saha'ya yazdığı güncelleme: ör. imalatın günlük girişi, şef "Saha akışına yansıt" dediyse.
 * Sıradan bir saha güncellemesidir (Saha'da ve sohbette görünür, yazarı düzeltir ya da siler); dosyalarını yazan
 * özellik aynı işlemde ekler. Kaynağı silinince gönderi de geri çekilir, yerinde silindi izi kalır.
 */
@Service
public class FieldPosts {

    private final PostRepository posts;
    private final MediaRemoval mediaRemoval;
    private final Clock clock;

    FieldPosts(PostRepository posts, MediaRemoval mediaRemoval, Clock clock) {
        this.posts = posts;
        this.mediaRemoval = mediaRemoval;
        this.clock = clock;
    }

    @Transactional
    public UUID publish(CurrentUser author, UUID siteId, String body) {
        var draft = new NewPost(UUID.randomUUID(), author.companyId(), siteId, author.userId(), body, false, null,
            false, true);
        return posts.save(new Post(draft, clock.instant())).getId();
    }

    /** Zaten silinmişse (yazarı Saha'dan sildiyse) bir şey yapılmaz. */
    @Transactional
    public void retract(CurrentUser by, UUID postId) {
        posts.findById(postId).filter(post -> !post.isDeleted()).ifPresent(post -> {
            post.delete(by.userId(), clock.instant());
            mediaRemoval.removeForPost(post.getId());
        });
    }
}
