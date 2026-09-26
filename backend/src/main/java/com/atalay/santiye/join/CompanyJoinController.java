package com.atalay.santiye.join;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.auth.SessionCookies;
import com.atalay.santiye.auth.SessionService;
import com.atalay.santiye.join.dto.JoinInvite;
import com.atalay.santiye.join.dto.JoinLink;
import com.atalay.santiye.join.dto.JoinRequest;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * Bağlantıyı firmadaki herkes paylaşır, yalnızca patron sıfırlar; açmak ve katılmak herkese açıktır (kimlik
 * bağlantının kendisidir).
 */
@RestController
@Tag(name = "Join")
public class CompanyJoinController {

    private final CompanyJoinService joins;
    private final SessionService sessions;
    private final SessionCookies cookies;

    CompanyJoinController(CompanyJoinService joins, SessionService sessions, SessionCookies cookies) {
        this.joins = joins;
        this.sessions = sessions;
        this.cookies = cookies;
    }

    /** Bağlantıyı firmadaki herkes görür ve paylaşır: çalışan da yeni gelen arkadaşını getirebilsin. */
    @GetMapping("/company/join-link")
    public JoinLink getJoinLink(@AuthenticationPrincipal CurrentUser user) {
        return joins.link(user);
    }

    /** Sıfırlamak yalnızca patronun işi: herkesin elindeki bağlantıyı öldürür, yanlışlıkla basılmasın. */
    @PostMapping("/company/join-link/reset")
    @PreAuthorize("hasRole('OWNER')")
    public JoinLink resetJoinLink(@AuthenticationPrincipal CurrentUser owner) {
        return joins.reset(owner);
    }

    @GetMapping("/join/{token}")
    public JoinInvite getJoinInvite(@PathVariable String token, @AuthenticationPrincipal CurrentUser viewer) {
        return joins.describe(token, viewer);
    }

    /** Oturumu olmayan yeni kişiye burada oturum açılır: bağlantıya dokunan kişi doğrudan şantiyelerin içine düşer. */
    @PostMapping("/join/{token}")
    public ResponseEntity<Void> acceptJoinInvite(@PathVariable String token,
        @AuthenticationPrincipal CurrentUser viewer, @Valid @RequestBody JoinRequest request, HttpServletRequest http) {
        Joined joined = joins.accept(token, viewer, request);
        ResponseEntity.BodyBuilder response = ResponseEntity.ok();
        if (joined.newcomer() != null) {
            String session = sessions.open(joined.newcomer(), http.getHeader(HttpHeaders.USER_AGENT));
            response.header(HttpHeaders.SET_COOKIE, cookies.issue(session).toString());
        }
        return response.build();
    }
}
