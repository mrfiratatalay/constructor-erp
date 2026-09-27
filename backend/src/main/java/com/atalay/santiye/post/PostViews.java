package com.atalay.santiye.post;

import com.atalay.santiye.media.MediaViews;
import com.atalay.santiye.media.dto.MediaView;
import com.atalay.santiye.post.dto.IssueResolution;
import com.atalay.santiye.post.dto.PostAuthorRef;
import com.atalay.santiye.post.dto.PostDeletion;
import com.atalay.santiye.post.dto.PostPin;
import com.atalay.santiye.post.dto.PostQuote;
import com.atalay.santiye.post.dto.PostSiteRef;
import com.atalay.santiye.post.dto.PostView;
import com.atalay.santiye.site.Site;
import com.atalay.santiye.site.SiteRepository;
import com.atalay.santiye.user.AppUser;
import com.atalay.santiye.user.UserRepository;
import com.atalay.santiye.visit.SeenReceipts;
import com.atalay.santiye.visit.dto.SeenBy;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.springframework.stereotype.Component;

/**
 * Gönderileri ekrana hazırlar. Şantiye, kişi, medya, alıntı ve "kim gördü" bilgisi gönderi başına değil toplu
 * sorgulanır: 20 gönderi 100 sorgu değil birkaç sorgu demektir ("N+1 sorgu" problemi).
 */
@Component
class PostViews {

    private final SiteRepository sites;
    private final UserRepository users;
    private final MediaViews media;
    private final PostQuotes quotes;
    private final SeenReceipts receipts;

    PostViews(SiteRepository sites, UserRepository users, MediaViews media, PostQuotes quotes, SeenReceipts receipts) {
        this.sites = sites;
        this.users = users;
        this.media = media;
        this.quotes = quotes;
        this.receipts = receipts;
    }

    /** Bir sayfa gönderinin toplu çekilmiş bilgileri. */
    private record Lookups(Map<UUID, Site> sites, Map<UUID, AppUser> people, Map<UUID, List<MediaView>> media,
        Map<UUID, PostQuote> quotes, Map<UUID, List<SeenBy>> participants) {
    }

    List<PostView> of(List<Post> posts) {
        if (posts.isEmpty()) {
            return List.of();
        }
        List<UUID> siteIds = posts.stream().map(Post::getSiteId).distinct().toList();
        Lookups lookups = new Lookups(
            byId(sites.findAllById(siteIds), Site::getId),
            byId(users.findAllById(peopleIn(posts)), AppUser::getId),
            media.byPost(posts.stream().map(Post::getId).toList()),
            quotes.of(posts),
            receipts.participantsBySite(posts.getFirst().getCompanyId(), siteIds));
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
            deletionOf(post, lookups.people()),
            post.getReplyToId() == null ? null : lookups.quotes().get(post.getReplyToId()),
            post.isForwarded(),
            pinOf(post, lookups.people()),
            seenByAll(post, lookups.participants().getOrDefault(post.getSiteId(), List.of())),
            post.isFieldUpdate(),
            post.getRollCallDay());
    }

    private static PostAuthorRef authorOf(AppUser author) {
        return new PostAuthorRef(author.getId(), author.getFullName(), author.getPhone());
    }

    /** Yazarlar, sorunu çözenler, gönderiyi silenler ve sabitleyenler tek sorguda. */
    private static List<UUID> peopleIn(List<Post> posts) {
        return posts.stream()
            .flatMap(post -> Stream.of(post.getAuthorId(), post.getResolvedBy(), post.getDeletedBy(), post.getPinnedBy()))
            .filter(Objects::nonNull)
            .distinct()
            .toList();
    }

    /**
     * Mavi ✓✓: yazar dışındaki bütün katılımcılar şantiyeye bu mesajdan sonra baktı. Başka katılımcı yoksa
     * görecek kimse de yoktur; tik mavi yanmaz.
     */
    private static boolean seenByAll(Post post, List<SeenBy> participants) {
        List<SeenBy> others = participants.stream().filter(seen -> !seen.userId().equals(post.getAuthorId())).toList();
        return !others.isEmpty() && others.stream()
            .allMatch(seen -> seen.seenAt() != null && !seen.seenAt().isBefore(post.getCreatedAt()));
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

    private static PostPin pinOf(Post post, Map<UUID, AppUser> people) {
        if (!post.isPinned()) {
            return null;
        }
        return new PostPin(post.getPinnedAt(), people.get(post.getPinnedBy()).getFullName());
    }

    private static <T> Map<UUID, T> byId(List<T> items, Function<T, UUID> id) {
        return items.stream().collect(Collectors.toMap(id, Function.identity()));
    }
}
