package com.atalay.santiye.post;

import com.atalay.santiye.media.MediaViews;
import com.atalay.santiye.media.dto.MediaView;
import com.atalay.santiye.post.dto.IssueResolution;
import com.atalay.santiye.post.dto.PostAuthorRef;
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
 * Gönderileri ekrana hazırlar. Şantiye, yazar ve medya bilgisi gönderi başına değil toplu sorgulanır:
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

    List<PostView> of(List<Post> posts) {
        Map<UUID, Site> siteById = byId(sites.findAllById(posts.stream().map(Post::getSiteId).toList()), Site::getId);
        Map<UUID, AppUser> peopleById = byId(users.findAllById(peopleIn(posts)), AppUser::getId);
        Map<UUID, List<MediaView>> mediaByPost = media.byPost(posts.stream().map(Post::getId).toList());
        return posts.stream().map(post -> new PostView(
            post.getId(),
            new PostSiteRef(post.getSiteId(), siteById.get(post.getSiteId()).getName()),
            new PostAuthorRef(post.getAuthorId(), peopleById.get(post.getAuthorId()).getFullName()),
            post.getBody(),
            post.isIssue(),
            post.getCreatedAt(),
            mediaByPost.getOrDefault(post.getId(), List.of()),
            resolutionOf(post, peopleById))).toList();
    }

    /** Yazarlar ve sorunu çözenler tek sorguda. */
    private static List<UUID> peopleIn(List<Post> posts) {
        return posts.stream()
            .flatMap(post -> Stream.of(post.getAuthorId(), post.getResolvedBy()))
            .filter(Objects::nonNull)
            .distinct()
            .toList();
    }

    private static IssueResolution resolutionOf(Post post, Map<UUID, AppUser> peopleById) {
        if (post.getResolvedAt() == null) {
            return null;
        }
        String by = peopleById.get(post.getResolvedBy()).getFullName();
        return new IssueResolution(post.getResolvedAt(), by, post.getResolutionNote());
    }

    PostView of(Post post) {
        return of(List.of(post)).getFirst();
    }

    private static <T> Map<UUID, T> byId(List<T> items, Function<T, UUID> id) {
        return items.stream().collect(Collectors.toMap(id, Function.identity()));
    }
}
