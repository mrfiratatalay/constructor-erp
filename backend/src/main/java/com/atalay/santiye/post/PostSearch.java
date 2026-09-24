package com.atalay.santiye.post;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.post.dto.PostView;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Mesaj araması (WhatsApp'taki arama gibi): "demir" yazınca geçen ayki "Demir geldi" mesajı bulunur.
 * siteId verilirse yalnızca o şantiyede ("Bu şantiyede ara"), verilmezse görünen bütün şantiyelerde.
 */
@Service
public class PostSearch {

    private static final int MIN_LENGTH = 2;
    private static final int LIMIT = 40;
    private static final Locale TURKISH = Locale.forLanguageTag("tr");

    private final PostRepository posts;
    private final VisiblePosts visible;
    private final PostViews views;

    PostSearch(PostRepository posts, VisiblePosts visible, PostViews views) {
        this.posts = posts;
        this.visible = visible;
        this.views = views;
    }

    @Transactional(readOnly = true)
    public List<PostView> search(CurrentUser user, String query, UUID siteId) {
        String text = query == null ? "" : query.strip();
        List<UUID> siteIds = visible.siteIds(user, siteId);
        if (text.length() < MIN_LENGTH || siteIds.isEmpty()) {
            return List.of();
        }
        return views.of(posts.search(siteIds, "%" + escape(text.toLowerCase(TURKISH)) + "%", PageRequest.of(0, LIMIT)));
    }

    /** Kullanıcının yazdığı % ve _ joker değil, düz karakterdir. */
    private static String escape(String text) {
        return text.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_");
    }
}
