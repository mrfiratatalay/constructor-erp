package com.atalay.santiye.auth;

import com.atalay.santiye.auth.dto.AcceptInviteRequest;
import com.atalay.santiye.auth.dto.CurrentUserResponse;
import com.atalay.santiye.auth.dto.LoginRequest;
import com.atalay.santiye.auth.dto.SessionContextView;
import com.atalay.santiye.auth.dto.SwitchWorkspaceRequest;
import com.atalay.santiye.common.error.ApiException;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@Tag(name = "Auth")
public class AuthController {

    private final AuthService auth;
    private final InviteService invites;
    private final SessionService sessions;
    private final SessionCookies cookies;
    private final SessionContexts contexts;

    AuthController(AuthService auth, InviteService invites, SessionService sessions, SessionCookies cookies,
        SessionContexts contexts) {
        this.auth = auth;
        this.invites = invites;
        this.sessions = sessions;
        this.cookies = cookies;
        this.contexts = contexts;
    }

    @PostMapping("/login")
    public ResponseEntity<CurrentUserResponse> login(@Valid @RequestBody LoginRequest request, HttpServletRequest http) {
        return signIn(auth.login(request.email(), request.password()), http);
    }

    @PostMapping("/invites/accept")
    public ResponseEntity<CurrentUserResponse> acceptInvite(
        @Valid @RequestBody AcceptInviteRequest request, HttpServletRequest http) {
        return signIn(invites.accept(request.token()), http);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest http) {
        cookies.read(http).ifPresent(sessions::close);
        return ResponseEntity.noContent().header(HttpHeaders.SET_COOKIE, cookies.clear().toString()).build();
    }

    @GetMapping("/me")
    public CurrentUserResponse getCurrentUser(@AuthenticationPrincipal CurrentUser user) {
        return auth.describe(user);
    }

    /** Açılışta ilk soru: kim, hangi firmalarda, şu anki firmanın markası, modülleri ve abonelik durumu. */
    @GetMapping("/context")
    public SessionContextView getSessionContext(@AuthenticationPrincipal CurrentUser user) {
        return contexts.of(user);
    }

    /** Başka bir firmanın çalışma alanına geçer; üye olmadığı firmaya geçilemez. */
    @PostMapping("/workspace")
    public SessionContextView switchWorkspace(@AuthenticationPrincipal CurrentUser user,
        @Valid @RequestBody SwitchWorkspaceRequest request, HttpServletRequest http) {
        String token = cookies.read(http).orElseThrow(() -> ApiException.unauthorized("Oturum yok."));
        if (!sessions.switchWorkspace(token, user.userId(), request.companyId())) {
            throw ApiException.forbidden("Bu firmada üyeliğin yok.");
        }
        return contexts.of(sessions.authenticate(token).orElseThrow(() -> ApiException.unauthorized("Oturum yok.")));
    }

    private ResponseEntity<CurrentUserResponse> signIn(SignIn signIn, HttpServletRequest http) {
        String token = sessions.open(signIn, http.getHeader(HttpHeaders.USER_AGENT));
        return ResponseEntity.ok()
            .header(HttpHeaders.SET_COOKIE, cookies.issue(token).toString())
            .body(auth.describe(signIn));
    }
}
