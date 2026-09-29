package com.atalay.santiye.platform;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.onboarding.OnboardingInvites;
import com.atalay.santiye.onboarding.dto.OnboardingInviteView;
import com.atalay.santiye.onboarding.dto.OnboardingLink;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/** Platform yönetimi: firmanın kurulum linkleri. Link yalnızca üretildiği cevapta görünür. */
@RestController
@RequestMapping("/platform/tenants/{companyId}/invites")
@Tag(name = "Platform")
public class PlatformInviteController {

    private final OnboardingInvites invites;

    PlatformInviteController(OnboardingInvites invites) {
        this.invites = invites;
    }

    @GetMapping
    public List<OnboardingInviteView> listOnboardingInvites(@PathVariable UUID companyId) {
        return invites.of(companyId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OnboardingLink issueOnboardingInvite(@AuthenticationPrincipal CurrentUser admin,
        @PathVariable UUID companyId) {
        return invites.issue(companyId, admin.userId());
    }

    @PostMapping("/{inviteId}/revoke")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void revokeOnboardingInvite(@AuthenticationPrincipal CurrentUser admin, @PathVariable UUID companyId,
        @PathVariable UUID inviteId) {
        invites.revoke(companyId, inviteId, admin.userId());
    }
}
