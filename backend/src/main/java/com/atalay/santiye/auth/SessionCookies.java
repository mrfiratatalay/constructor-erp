package com.atalay.santiye.auth;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Optional;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;
import org.springframework.web.util.WebUtils;

/**
 * Oturum çerezi. HttpOnly: JavaScript okuyamaz, sayfaya sızan bir kod oturumu çalamaz.
 * SameSite=Strict: başka bir siteden gelen istekler çerezi hiç taşımaz (CSRF koruması).
 */
@Component
public class SessionCookies {

    static final String NAME = "ks_session";

    private final SessionProperties properties;

    SessionCookies(SessionProperties properties) {
        this.properties = properties;
    }

    public ResponseCookie issue(String token) {
        return base(token).maxAge(properties.lifetime()).build();
    }

    public ResponseCookie clear() {
        return base("").maxAge(0).build();
    }

    public Optional<String> read(HttpServletRequest request) {
        return Optional.ofNullable(WebUtils.getCookie(request, NAME))
            .map(Cookie::getValue)
            .filter(value -> !value.isBlank());
    }

    private ResponseCookie.ResponseCookieBuilder base(String value) {
        return ResponseCookie.from(NAME, value)
            .httpOnly(true)
            .secure(properties.secureCookie())
            .sameSite("Strict")
            .path("/api");
    }
}
