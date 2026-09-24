package com.atalay.santiye.post;

import com.atalay.santiye.media.MediaViews;
import com.atalay.santiye.media.dto.MediaView;
import com.atalay.santiye.post.dto.PostQuote;
import com.atalay.santiye.user.AppUser;
import com.atalay.santiye.user.UserRepository;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;

/** Bir sayfa gönderinin yanıtladığı mesajların alıntıları; sayfa başına üç sorgu. */
@Component
class PostQuotes {

    /** Alıntı tek satırdır; uzun rapor baloncuğun üstünü kaplamasın. */
    private static final int MAX_QUOTE = 160;

    private final PostRepository posts;
    private final UserRepository users;
    private final MediaViews media;

    PostQuotes(PostRepository posts, UserRepository users, MediaViews media) {
        this.posts = posts;
        this.users = users;
        this.media = media;
    }

    Map<UUID, PostQuote> of(List<Post> page) {
        List<UUID> quotedIds = page.stream().map(Post::getReplyToId).filter(Objects::nonNull).distinct().toList();
        if (quotedIds.isEmpty()) {
            return Map.of();
        }
        List<Post> quoted = posts.findAllById(quotedIds);
        Map<UUID, String> names = users.findAllById(quoted.stream().map(Post::getAuthorId).distinct().toList())
            .stream().collect(Collectors.toMap(AppUser::getId, AppUser::getFullName));
        Map<UUID, List<MediaView>> files = media.byPost(quotedIds);
        return quoted.stream().collect(Collectors.toMap(Post::getId,
            post -> quoteOf(post, names.get(post.getAuthorId()), files.getOrDefault(post.getId(), List.of()))));
    }

    private static PostQuote quoteOf(Post post, String authorName, List<MediaView> files) {
        MediaView first = files.isEmpty() ? null : files.getFirst();
        String body = post.getBody() == null ? null : post.getBody().strip();
        String shortBody = body == null || body.length() <= MAX_QUOTE ? body : body.substring(0, MAX_QUOTE) + "…";
        return new PostQuote(post.getId(), authorName, shortBody, first == null ? null : first.kind(),
            first == null ? null : first.thumbnailUrl(), post.isDeleted());
    }
}
