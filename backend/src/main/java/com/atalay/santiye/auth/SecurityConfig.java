package com.atalay.santiye.auth;

import com.atalay.santiye.billing.WorkspaceAccess;
import com.atalay.santiye.tenant.TenantContextFilter;
import jakarta.servlet.DispatcherType;
import java.util.UUID;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private static final String[] PUBLIC_PATHS = {
        "/api/auth/login", "/api/auth/logout", "/api/auth/invites/accept", "/api/join/**", "/api/public/**",
        "/api/setup/**",
        "/actuator/health", "/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html", "/error",
    };

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http, SessionService sessions, SessionCookies cookies,
        WorkspaceAccess access) throws Exception {
        return http
            // CSRF token'ı yerine SameSite=Strict çerez ve köken denetimi (bkz. SessionCookies, CrossOriginWriteFilter).
            .csrf(AbstractHttpConfigurer::disable)
            // Spring'in kendi oturumu yok; kimliği her istekte kendi çerezimizden okuyoruz.
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .httpBasic(AbstractHttpConfigurer::disable)
            .formLogin(AbstractHttpConfigurer::disable)
            .logout(AbstractHttpConfigurer::disable)
            .exceptionHandling(errors -> errors
                .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED))
                .accessDeniedHandler(new WorkspaceDeniedHandler(access)))
            .authorizeHttpRequests(auth -> auth
                .dispatcherTypeMatchers(DispatcherType.ERROR).permitAll()
                .requestMatchers(PUBLIC_PATHS).permitAll()
                // Oturum ve firma seçimi: firması kilitli olan da kim olduğunu ve neden kilitli olduğunu görebilmeli.
                .requestMatchers("/api/auth/**").authenticated()
                // Platform yönetimi yalnızca süper yöneticinin; firmanın patronu buraya giremez.
                .requestMatchers("/api/platform/**").hasRole("SUPER_ADMIN")
                // Geri kalan her uç firmanın çalışma alanıdır: yeni modül buraya eklenince firma kuralı kendiliğinden
                // gelir (MIMARI-SAAS.md Bölüm 6).
                .requestMatchers("/api/**").hasAuthority(SessionAuthenticationFilter.WORKSPACE)
                .anyRequest().denyAll())
            .addFilterBefore(new SessionAuthenticationFilter(sessions, cookies, access), UsernamePasswordAuthenticationFilter.class)
            // SameSite çerezinin yetmediği yer: aynı alan adının başka bir alt adresinden gelen yazma isteği.
            .addFilterBefore(new CrossOriginWriteFilter(), SessionAuthenticationFilter.class)
            // Firma bağlamı (RLS) kimlik doğrulandıktan sonra, yalnızca oturumdan kurulur.
            .addFilterAfter(new TenantContextFilter(SecurityConfig::companyOf), SessionAuthenticationFilter.class)
            .build();
    }

    private static UUID companyOf(Object principal) {
        return principal instanceof CurrentUser user ? user.companyId() : null;
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }
}
