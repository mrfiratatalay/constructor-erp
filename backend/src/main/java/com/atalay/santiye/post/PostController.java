package com.atalay.santiye.post;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.post.dto.CorrectPostRequest;
import com.atalay.santiye.post.dto.CreatePostForm;
import com.atalay.santiye.post.dto.PostPage;
import com.atalay.santiye.post.dto.PostView;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/posts")
@Tag(name = "Posts")
public class PostController {

    private final PostService posts;
    private final PostFeed feed;
    private final PostCorrections corrections;
    private final PostDeletions deletions;

    PostController(PostService posts, PostFeed feed, PostCorrections corrections, PostDeletions deletions) {
        this.posts = posts;
        this.feed = feed;
        this.corrections = corrections;
        this.deletions = deletions;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public PostView createPost(@AuthenticationPrincipal CurrentUser author, @Valid @ModelAttribute CreatePostForm form) {
        return posts.createPost(author, form);
    }

    @GetMapping
    public PostPage listPosts(@AuthenticationPrincipal CurrentUser user,
        @RequestParam(required = false) UUID siteId,
        @RequestParam(required = false) String cursor,
        @RequestParam(defaultValue = "20") int limit) {
        return feed.listPosts(user, siteId, cursor, limit);
    }

    @GetMapping("/{postId}")
    public PostView getPost(@AuthenticationPrincipal CurrentUser user, @PathVariable UUID postId) {
        return feed.getPost(user, postId);
    }

    @PatchMapping("/{postId}")
    public PostView correctPost(@AuthenticationPrincipal CurrentUser user, @PathVariable UUID postId,
        @Valid @RequestBody CorrectPostRequest request) {
        return corrections.correct(user, postId, request);
    }

    /** Silinen gönderinin izi döner: arayüz kartı yerinde "silindi" olarak gösterir. */
    @DeleteMapping("/{postId}")
    public PostView deletePost(@AuthenticationPrincipal CurrentUser user, @PathVariable UUID postId) {
        return deletions.delete(user, postId);
    }
}
