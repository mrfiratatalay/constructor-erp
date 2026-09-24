package com.atalay.santiye.join;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.auth.SessionCookies;
import com.atalay.santiye.auth.SessionService;
import com.atalay.santiye.join.dto.JoinSiteRequest;
import com.atalay.santiye.join.dto.SiteInviteLink;
import com.atalay.santiye.join.dto.SiteInviteView;
import com.atalay.santiye.join.dto.SiteJoinResult;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/** Bağlantıyı yalnızca patron üretir; bakmak ve katılmak herkese açıktır (kimlik bağlantının kendisidir). */
@RestController
@Tag(name = "SiteInvites")
public class SiteInviteController {

    private final SiteInviteService invites;
    private final SessionService sessions;
    private final SessionCookies cookies;

    SiteInviteController(SiteInviteService invites, SessionService sessions, SessionCookies cookies) {
        this.invites = invites;
        this.sessions = sessions;
        this.cookies = cookies;
    }

    @PostMapping("/sites/{siteId}/invites")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('OWNER')")
    public SiteInviteLink createSiteInvite(@AuthenticationPrincipal CurrentUser owner, @PathVariable UUID siteId) {
        return invites.create(owner, siteId);
    }

    @GetMapping("/site-invites/{token}")
    public SiteInviteView getSiteInvite(@PathVariable String token, @AuthenticationPrincipal CurrentUser viewer) {
        return invites.describe(token, viewer);
    }

    /** Oturumu olmayan yeni kişiye burada oturum açılır: linke dokunan kişi doğrudan şantiyenin içine düşer. */
    @PostMapping("/site-invites/{token}/accept")
    public ResponseEntity<SiteJoinResult> acceptSiteInvite(@PathVariable String token,
        @AuthenticationPrincipal CurrentUser viewer, @Valid @RequestBody JoinSiteRequest request, HttpServletRequest http) {
        Joined joined = invites.accept(token, viewer, request);
        ResponseEntity.BodyBuilder response = ResponseEntity.ok();
        if (joined.newcomer() != null) {
            String session = sessions.open(joined.newcomer(), http.getHeader(HttpHeaders.USER_AGENT));
            response.header(HttpHeaders.SET_COOKIE, cookies.issue(session).toString());
        }
        return response.body(new SiteJoinResult(joined.siteId()));
    }
}
