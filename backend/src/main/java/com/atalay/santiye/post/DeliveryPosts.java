package com.atalay.santiye.post;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.media.MediaIntake;
import com.atalay.santiye.media.MediaOwner;
import com.atalay.santiye.media.MediaViews;
import com.atalay.santiye.media.dto.MediaView;
import java.time.Clock;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

/**
 * İş teslimi sohbette (TASARIM.md "İş teslimi"): çalışanın fotoğraflı teslim mesajı ve şefin cevabı. İkisi de bir
 * teslime bağlı sıradan gönderidir: okunmadı rozeti, liste önizlemesi, tikler ve arama olduğu gibi çalışır; kartı
 * baloncukta arayüz çizer. Görev servisinin işlemi içinde çağrılır: teslim kaydedilemezse mesaj da geri alınır.
 */
@Service
public class DeliveryPosts {

    private final PostRepository posts;
    private final MediaIntake mediaIntake;
    private final MediaViews media;
    private final Clock clock;

    DeliveryPosts(PostRepository posts, MediaIntake mediaIntake, MediaViews media, Clock clock) {
        this.posts = posts;
        this.mediaIntake = mediaIntake;
        this.media = media;
        this.clock = clock;
    }

    /** Teslim mesajı: yazısı işin adı, dosyaları işin fotoğrafları. Mesajın kimliği döner. */
    public UUID postDelivery(CurrentUser author, DeliveryMessage message, List<MultipartFile> photos) {
        Post post = save(author, message);
        mediaIntake.accept(new MediaOwner(post.getId(), post.getSiteId(), post.getCompanyId()), photos);
        return post.getId();
    }

    /** Şefin cevabı (onay ya da eksik): teslim mesajına yanıt olarak düşer, çalışan sohbette görür. */
    public UUID postReview(CurrentUser author, DeliveryMessage message) {
        return save(author, message).getId();
    }

    /** Teslimin fotoğrafları: teslim mesajının dosyaları, sırasıyla. */
    public List<MediaView> photosOf(UUID postId) {
        return media.byPost(List.of(postId)).getOrDefault(postId, List.of());
    }

    private Post save(CurrentUser author, DeliveryMessage message) {
        var draft = new NewPost(UUID.randomUUID(), author.companyId(), message.siteId(), author.userId(), message.body(),
            false, message.replyToId(), false, false);
        return posts.save(Post.linked(draft, PostLink.delivery(message.deliveryId()), clock.instant()));
    }
}
