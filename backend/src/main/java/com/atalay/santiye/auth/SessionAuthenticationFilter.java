package com.atalay.santiye.auth;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Her istekte oturum çerezini okur; geçerliyse kullanıcıyı güvenlik bağlamına koyar.
 * Bilerek @Component değil: bean olsaydı Spring Boot onu servlet zincirine de ekler, iki kez çalışırdı.
 */
class SessionAuthenticationFilter extends OncePerRequestFilter {

    private final SessionService sessions;
    private final SessionCookies cookies;

    SessionAuthenticationFilter(SessionService sessions, SessionCookies cookies) {
        this.sessions = sessions;
        this.cookies = cookies;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
        throws ServletException, IOException {
        cookies.read(request).flatMap(sessions::authenticate).ifPresent(this::signIn);
        chain.doFilter(request, response);
    }

    private void signIn(CurrentUser user) {
        var authority = new SimpleGrantedAuthority("ROLE_" + user.role().name());
        var authentication = new UsernamePasswordAuthenticationToken(user, null, List.of(authority));
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);
    }
}
