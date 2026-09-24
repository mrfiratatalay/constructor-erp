package com.atalay.santiye.post;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.post.dto.ForwardPostRequest;
import com.atalay.santiye.post.dto.PostView;
import com.atalay.santiye.visit.dto.SeenBy;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/** Mesaja uzun basınca yapılanlar (Sabitle, İlet, Bilgi) ve mesaj araması. */
@RestController
@RequestMapping("/posts")
@Tag(name = "Posts")
public class PostActionController {

    private final PostPins pins;
    private final PostForwarding forwarding;
    private final PostSearch search;
    private final PostReceipts receipts;

    PostActionController(PostPins pins, PostForwarding forwarding, PostSearch search, PostReceipts receipts) {
        this.pins = pins;
        this.forwarding = forwarding;
        this.search = search;
        this.receipts = receipts;
    }

    @GetMapping("/search")
    public List<PostView> searchPosts(@AuthenticationPrincipal CurrentUser user, @RequestParam String q,
        @RequestParam(required = false) UUID siteId) {
        return search.search(user, q, siteId);
    }

    /** Şantiyenin sabit mesajları, en son sabitlenen önde. */
    @GetMapping("/pinned")
    public List<PostView> listPinnedPosts(@AuthenticationPrincipal CurrentUser user, @RequestParam UUID siteId) {
        return pins.pinned(user, siteId);
    }

    @PutMapping("/{postId}/pin")
    public PostView pinPost(@AuthenticationPrincipal CurrentUser user, @PathVariable UUID postId) {
        return pins.pin(user, postId);
    }

    @DeleteMapping("/{postId}/pin")
    public PostView unpinPost(@AuthenticationPrincipal CurrentUser user, @PathVariable UUID postId) {
        return pins.unpin(user, postId);
    }

    @PostMapping("/{postId}/forward")
    @ResponseStatus(HttpStatus.CREATED)
    public PostView forwardPost(@AuthenticationPrincipal CurrentUser user, @PathVariable UUID postId,
        @Valid @RequestBody ForwardPostRequest request) {
        return forwarding.forward(user, postId, request.siteId());
    }

    /** Yazar dışındaki katılımcılar ve mesajı ne zaman gördükleri. */
    @GetMapping("/{postId}/receipts")
    public List<SeenBy> listPostReceipts(@AuthenticationPrincipal CurrentUser user, @PathVariable UUID postId) {
        return receipts.receipts(user, postId);
    }
}
