package com.atalay.santiye.auth;

import com.atalay.santiye.billing.WorkspaceAccess;
import com.atalay.santiye.billing.WorkspaceStatus;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.stream.Stream;
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

    static final String WORKSPACE = "WORKSPACE";
    private static final String FEATURE = "FEATURE_";

    private final SessionService sessions;
    private final SessionCookies cookies;
    private final WorkspaceAccess access;

    SessionAuthenticationFilter(SessionService sessions, SessionCookies cookies, WorkspaceAccess access) {
        this.sessions = sessions;
        this.cookies = cookies;
        this.access = access;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
        throws ServletException, IOException {
        cookies.read(request).flatMap(sessions::authenticate).ifPresent(this::signIn);
        chain.doFilter(request, response);
    }

    /**
     * Yetkiler: firmadaki rol (hasRole), rolün açtığı işler (hasAuthority, bkz. Permission), platform rolü
     * (ROLE_SUPER_ADMIN). Firmanın çalışma alanı açıksa (firma aktif, abonelik geçerli) WORKSPACE ve paketin açtığı
     * modüller (FEATURE_…) de eklenir; firma uçları WORKSPACE ister (SecurityConfig).
     */
    private void signIn(CurrentUser user) {
        List<SimpleGrantedAuthority> authorities = authoritiesOf(user).map(SimpleGrantedAuthority::new).toList();
        var authentication = new UsernamePasswordAuthenticationToken(user, null, authorities);
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);
    }

    private Stream<String> authoritiesOf(CurrentUser user) {
        Stream<String> platform = user.platformAdmin() ? Stream.of("ROLE_SUPER_ADMIN") : Stream.empty();
        if (!user.hasWorkspace()) {
            return platform;
        }
        WorkspaceStatus status = access.statusOf(user.companyId());
        Stream<String> role = Stream.concat(Stream.of("ROLE_" + user.role().name()),
            Permission.grantedTo(user.role(), status.features()).stream().map(Permission::name));
        Stream<String> open = status.open()
            ? Stream.concat(Stream.of(WORKSPACE), status.features().stream().map(FEATURE::concat)) : Stream.empty();
        return Stream.concat(platform, Stream.concat(role, open));
    }
}
