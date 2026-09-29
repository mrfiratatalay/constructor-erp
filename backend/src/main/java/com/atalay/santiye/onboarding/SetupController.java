package com.atalay.santiye.onboarding;

import com.atalay.santiye.auth.SessionContexts;
import com.atalay.santiye.auth.SessionCookies;
import com.atalay.santiye.auth.SessionService;
import com.atalay.santiye.auth.SignIn;
import com.atalay.santiye.auth.dto.SessionContextView;
import com.atalay.santiye.common.error.ApiException;
import com.atalay.santiye.onboarding.dto.CompleteSetupRequest;
import com.atalay.santiye.onboarding.dto.LogoUploaded;
import com.atalay.santiye.onboarding.dto.SetupInviteView;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

/** Kurulum sihirbazı (oturum gerekmez; kimlik linkin kendisidir). Bitince patronun oturumu açılır. */
@RestController
@RequestMapping("/setup/{token}")
@Tag(name = "Setup")
public class SetupController {

    private final SetupService setup;
    private final SessionService sessions;
    private final SessionCookies cookies;
    private final SessionContexts contexts;

    SetupController(SetupService setup, SessionService sessions, SessionCookies cookies, SessionContexts contexts) {
        this.setup = setup;
        this.sessions = sessions;
        this.cookies = cookies;
        this.contexts = contexts;
    }

    @GetMapping
    public SetupInviteView getSetupInvite(@PathVariable String token) {
        return setup.describe(token);
    }

    @PostMapping(value = "/logo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public LogoUploaded uploadSetupLogo(@PathVariable String token, @RequestPart("file") MultipartFile file) {
        return setup.uploadLogo(token, file);
    }

    @PostMapping
    public ResponseEntity<SessionContextView> completeSetup(@PathVariable String token,
        @Valid @RequestBody CompleteSetupRequest request, HttpServletRequest http) {
        SignIn signIn = setup.complete(token, request);
        String session = sessions.open(signIn, http.getHeader(HttpHeaders.USER_AGENT));
        SessionContextView context = contexts.of(sessions.authenticate(session)
            .orElseThrow(() -> ApiException.unauthorized("Oturum açılamadı.")));
        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookies.issue(session).toString()).body(context);
    }
}
