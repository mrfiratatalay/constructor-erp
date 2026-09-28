package com.atalay.santiye.post;

import com.atalay.santiye.auth.CurrentUser;
import java.time.Clock;
import java.util.Optional;
import java.util.UUID;
import org.springframework.stereotype.Service;

/**
 * Görev kartı (TASARIM.md "İş teslimi"): görev nereden açılırsa açılsın şantiyenin sohbetine "📋 Görev" mesajı
 * düşer; baloncukta görevin kartı çizilir. İşin teslimi bu karta yanıt olarak düşer: sohbette görev, teslim ve
 * şefin cevabı alt alta tek hikâye olarak okunur. Görev servisinin işlemi içinde çağrılır.
 */
@Service
public class TaskCards {

    private final PostRepository posts;
    private final Clock clock;

    TaskCards(PostRepository posts, Clock clock) {
        this.posts = posts;
        this.clock = clock;
    }

    /** Kart mesajı açanın adıyla düşer; görev bir mesajdan açıldıysa o mesaja yanıttır. Mesajın kimliği döner. */
    public UUID postCard(CurrentUser author, TaskCardMessage card) {
        var draft = new NewPost(UUID.randomUUID(), author.companyId(), card.siteId(), author.userId(), card.body(),
            false, card.replyToId(), false, false);
        return posts.save(Post.linked(draft, PostLink.task(card.taskId()), clock.instant())).getId();
    }

    /** Görevin sohbetteki kartı; bu özellikten önce açılan görevin kartı yoktur. */
    public Optional<UUID> cardOf(UUID taskId) {
        return posts.findFirstByLinkTaskIdAndDeletedAtIsNullOrderByCreatedAtAsc(taskId).map(Post::getId);
    }
}
