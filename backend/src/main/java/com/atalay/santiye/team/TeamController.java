package com.atalay.santiye.team;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.auth.InviteLink;
import com.atalay.santiye.team.dto.MemberView;
import com.atalay.santiye.team.dto.UpdateMemberRequest;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Kişi yönetimi yalnızca patrona açık. Yeni kişi buradan eklenmez: firmanın bağlantısıyla kendisi gelir. */
@RestController
@RequestMapping("/team/members")
@PreAuthorize("hasRole('OWNER')")
@Tag(name = "Team")
public class TeamController {

    private final TeamService team;

    TeamController(TeamService team) {
        this.team = team;
    }

    @PatchMapping("/{memberId}")
    public MemberView updateMember(@AuthenticationPrincipal CurrentUser owner, @PathVariable UUID memberId,
        @Valid @RequestBody UpdateMemberRequest request) {
        return team.updateMember(owner, memberId, request);
    }

    @PostMapping("/{memberId}/login-link")
    public InviteLink issueLoginLink(@AuthenticationPrincipal CurrentUser owner, @PathVariable UUID memberId) {
        return team.issueLoginLink(owner, memberId);
    }
}
