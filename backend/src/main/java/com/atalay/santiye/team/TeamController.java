package com.atalay.santiye.team;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.auth.InviteLink;
import com.atalay.santiye.team.dto.CreateMemberRequest;
import com.atalay.santiye.team.dto.MemberCreatedResponse;
import com.atalay.santiye.team.dto.MemberView;
import com.atalay.santiye.team.dto.UpdateMemberRequest;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/** Ekip yönetimi yalnızca patrona açık. */
@RestController
@RequestMapping("/team/members")
@PreAuthorize("hasRole('OWNER')")
@Tag(name = "Team")
public class TeamController {

    private final TeamService team;

    TeamController(TeamService team) {
        this.team = team;
    }

    @GetMapping
    public List<MemberView> listMembers(@AuthenticationPrincipal CurrentUser owner) {
        return team.listMembers(owner);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MemberCreatedResponse createMember(
        @AuthenticationPrincipal CurrentUser owner, @Valid @RequestBody CreateMemberRequest request) {
        return team.createMember(owner, request);
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
