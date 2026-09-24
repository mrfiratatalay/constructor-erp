package com.atalay.santiye.post;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.common.error.ApiException;
import com.atalay.santiye.post.dto.PostView;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * "Sahaya ekle": şef alışkanlıkla "Beton döküldü" + fotoğrafı sohbete atar; o mesaj tek dokunuşla şantiyenin
 * günlüğüne girer, atıldığı zamandaki yerine. Sabitleme gibi şantiyeyi gören herkes ekler ve çıkarır. Mesajın
 * yazısı, fotoğrafı ve yazarı değişmez; sohbette yerinde kalır.
 */
@Service
public class PostFieldMarks {

    private final VisiblePosts visible;
    private final PostViews views;

    PostFieldMarks(VisiblePosts visible, PostViews views) {
        this.visible = visible;
        this.views = views;
    }

    @Transactional
    public PostView addToField(CurrentUser user, UUID postId) {
        Post post = visible.require(user, postId).post();
        if (post.isDeleted()) {
            throw ApiException.conflict("Silinmiş mesaj Saha'ya eklenemez.");
        }
        post.markFieldUpdate(true);
        return views.of(post);
    }

    @Transactional
    public PostView removeFromField(CurrentUser user, UUID postId) {
        Post post = visible.require(user, postId).post();
        post.markFieldUpdate(false);
        return views.of(post);
    }
}
