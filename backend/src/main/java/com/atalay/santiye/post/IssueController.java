package com.atalay.santiye.post;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.post.dto.PostView;
import com.atalay.santiye.post.dto.ResolveIssueRequest;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "Issues")
public class IssueController {

    private final IssueService issues;

    IssueController(IssueService issues) {
        this.issues = issues;
    }

    /** open=true: çözülmeyi bekleyenler; open=false: son çözülenler. */
    @GetMapping("/issues")
    public List<PostView> listIssues(@AuthenticationPrincipal CurrentUser user,
        @RequestParam(defaultValue = "true") boolean open,
        @RequestParam(required = false) UUID siteId) {
        return issues.listIssues(user, open, siteId);
    }

    @PostMapping("/posts/{postId}/resolve")
    public PostView resolveIssue(@AuthenticationPrincipal CurrentUser user, @PathVariable UUID postId,
        @Valid @RequestBody ResolveIssueRequest request) {
        return issues.resolveIssue(user, postId, request.note());
    }
}
