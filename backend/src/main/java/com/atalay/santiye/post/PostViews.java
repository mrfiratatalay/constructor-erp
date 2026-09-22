package com.atalay.santiye.post;

import com.atalay.santiye.media.MediaViews;
import com.atalay.santiye.media.dto.MediaView;
import com.atalay.santiye.post.dto.IssueResolution;
import com.atalay.santiye.post.dto.PostAuthorRef;
import com.atalay.santiye.post.dto.PostDeletion;
import com.atalay.santiye.post.dto.PostSiteRef;
import com.atalay.santiye.post.dto.PostView;
import com.atalay.santiye.site.Site;
import com.atalay.santiye.site.SiteRepository;
import com.atalay.santiye.user.AppUser;
import com.atalay.santiye.user.UserRepository;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.springframework.stereotype.Component;

/**
 * Gönderileri ekrana hazırlar. Şantiye, kişi ve medya bilgisi gönderi başına değil toplu sorgulanır:
 * 20 gönderi 60 sorgu değil 3 sorgu demektir ("N+1 sorgu" problemi).
 */
@Component
class PostViews {

    private final SiteRepository sites;
    private final UserRepository users;
    private final MediaViews media;

    PostViews(SiteRepository sites, UserRepository users, MediaViews media) {
        this.sites = sites;
        this.users = users;
        this.media = media;
    }

    /** Bir sayfa gönderinin toplu çekilmiş şantiye, kişi ve medya bilgisi. */
    private record Lookups(Map<UUID, Site> sites, Map<UUID, AppUser> people, Map<UUID, List<MediaView>> media) {
    }

    List<PostView> of(List<Post> posts) {
        Lookups lookups = new Lookups(
            byId(sites.findAllById(posts.stream().map(Post::getSiteId).toList()), Site::getId),
            byId(users.findAllById(peopleIn(posts)), AppUser::getId),
            media.byPost(posts.stream().map(Post::getId).toList()));
        return posts.stream().map(post -> toView(post, lookups)).toList();
    }

    PostView of(Post post) {
        return of(List.of(post)).getFirst();
    }

    private static PostView toView(Post post, Lookups lookups) {
        return new PostView(
            post.getId(),
            new PostSiteRef(post.getSiteId(), lookups.sites().get(post.getSiteId()).getName()),
            authorOf(lookups.people().get(post.getAuthorId())),
            post.getBody(),
            post.isIssue(),
            post.getCreatedAt(),
            lookups.media().getOrDefault(post.getId(), List.of()),
            resolutionOf(post, lookups.people()),
            post.getEditedAt(),
            deletionOf(post, lookups.people()));
    }

    private static PostAuthorRef authorOf(AppUser author) {
        return new PostAuthorRef(author.getId(), author.getFullName(), author.getPhone());
    }

    /** Yazarlar, sorunu çözenler ve gönderiyi silenler tek sorguda. */
    private static List<UUID> peopleIn(List<Post> posts) {
        return posts.stream()
            .flatMap(post -> Stream.of(post.getAuthorId(), post.getResolvedBy(), post.getDeletedBy()))
            .filter(Objects::nonNull)
            .distinct()
            .toList();
    }

    /** Silinen gönderide çözüm bilgisi gösterilmez: yerinde yalnızca silinme izi kalır. */
    private static IssueResolution resolutionOf(Post post, Map<UUID, AppUser> people) {
        if (post.getResolvedAt() == null || post.isDeleted()) {
            return null;
        }
        String by = people.get(post.getResolvedBy()).getFullName();
        return new IssueResolution(post.getResolvedAt(), by, post.getResolutionNote());
    }

    private static PostDeletion deletionOf(Post post, Map<UUID, AppUser> people) {
        if (!post.isDeleted()) {
            return null;
        }
        return new PostDeletion(post.getDeletedAt(), people.get(post.getDeletedBy()).getFullName());
    }

    private static <T> Map<UUID, T> byId(List<T> items, Function<T, UUID> id) {
        return items.stream().collect(Collectors.toMap(id, Function.identity()));
    }
}
