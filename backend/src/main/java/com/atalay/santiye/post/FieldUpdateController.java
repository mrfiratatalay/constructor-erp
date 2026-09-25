package com.atalay.santiye.post;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.post.dto.PostPage;
import com.atalay.santiye.post.dto.PostView;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.UUID;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/** Şantiyenin Saha sekmesi: günlüğün akışı ve sohbetten "Sahaya ekle" / "Sahadan çıkar". */
@RestController
@RequestMapping("/posts")
@Tag(name = "Posts")
public class FieldUpdateController {

    private final PostFeed feed;
    private final PostFieldMarks marks;

    FieldUpdateController(PostFeed feed, PostFieldMarks marks) {
        this.feed = feed;
        this.marks = marks;
    }

    /** Yalnızca saha güncellemeleri, en yeniden eskiye. */
    @GetMapping("/field-updates")
    public PostPage listFieldUpdates(@AuthenticationPrincipal CurrentUser user,
        @RequestParam UUID siteId,
        @RequestParam(required = false) String cursor,
        @RequestParam(defaultValue = "20") int limit) {
        return feed.listFieldUpdates(user, siteId, cursor, limit);
    }

    @PutMapping("/{postId}/field")
    public PostView addPostToField(@AuthenticationPrincipal CurrentUser user, @PathVariable UUID postId) {
        return marks.addToField(user, postId);
    }

    @DeleteMapping("/{postId}/field")
    public PostView removePostFromField(@AuthenticationPrincipal CurrentUser user, @PathVariable UUID postId) {
        return marks.removeFromField(user, postId);
    }
}
