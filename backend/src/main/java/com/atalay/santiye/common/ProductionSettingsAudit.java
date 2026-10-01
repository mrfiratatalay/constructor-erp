package com.atalay.santiye.common;

import com.atalay.santiye.user.PlatformRole;
import com.atalay.santiye.user.UserRepository;
import java.io.IOException;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Locale;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.core.env.Environment;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Component;

/** Geliştirme ayarlarıyla canlıya çıkılmasını ve sessizce yarım kalan ilk kurulumu engeller. */
@Component
@Profile("prod")
@Order(-100)
class ProductionSettingsAudit implements ApplicationRunner {

    private final Environment environment;
    private final UserRepository users;
    private final JdbcClient jdbc;

    ProductionSettingsAudit(Environment environment, UserRepository users, JdbcClient jdbc) {
        this.environment = environment;
        this.users = users;
        this.jdbc = jdbc;
    }

    @Override
    public void run(ApplicationArguments args) {
        require(!environment.matchesProfiles("local", "e2e"), "prod, local/e2e profilleriyle birlikte kullanılamaz.");
        // Süper kullanıcı (ya da BYPASSRLS) firma ayrımının veritabanı katmanını (RLS) aşar; uygulama her isteğin
        // başında role geçse de bir SQL hatası ona geri dönüp bütün firmaları, hatta sunucuyu ele geçirebilirdi.
        require(!databaseUserBypassesRowSecurity(), "Production veritabanı kullanıcısı süper kullanıcı olmamalı ve RLS'i "
            + "aşamamalı (BYPASSRLS): tabloların sahibi olan sıradan bir kullanıcıyla bağlanın.");
        require(enabled("app.session.secure-cookie"), "Production oturum çerezi Secure olmalı.");
        require(!enabled("springdoc.api-docs.enabled") && !enabled("springdoc.swagger-ui.enabled"),
            "Production API dokümanı kapalı olmalı.");
        require(enabled("spring.flyway.clean-disabled"), "Production Flyway clean kapalı olmalı.");
        require(!enabled("spring.flyway.baseline-on-migrate"), "Production otomatik Flyway baseline kapalı olmalı.");
        validateBaseUrl();
        validateMediaRoot();
        validateBootstrap("app.platform.", List.of("admin-name", "admin-email", "admin-password"));
        validateBootstrap("app.bootstrap.", List.of("company-name", "owner-name", "owner-email", "owner-password"));
        require(users.existsByPlatformRole(PlatformRole.SUPER_ADMIN) || hasText("app.platform.admin-password"),
            "İlk production kurulumu için PLATFORM_ADMIN_NAME, PLATFORM_ADMIN_EMAIL, PLATFORM_ADMIN_PASSWORD gerekli.");
    }

    private void validateBaseUrl() {
        URI origin;
        try {
            origin = URI.create(environment.getRequiredProperty("app.invite.base-url"));
        } catch (IllegalArgumentException error) {
            throw new IllegalStateException("APP_BASE_URL geçerli bir HTTPS frontend adresi olmalı.", error);
        }
        require("https".equalsIgnoreCase(origin.getScheme()) && origin.getHost() != null
            && origin.getRawUserInfo() == null && origin.getRawQuery() == null && origin.getRawFragment() == null
            && (origin.getRawPath() == null || origin.getRawPath().isEmpty()),
            "APP_BASE_URL yalnızca HTTPS frontend adresi olmalı; yol veya sonuna / eklemeyin.");
    }

    private void validateMediaRoot() {
        Path root = Path.of(environment.getRequiredProperty("app.media.root"));
        require(root.isAbsolute(), "MEDIA_ROOT kalıcı diskteki mutlak klasör yolu olmalı.");
        try {
            Files.createDirectories(root);
        } catch (IOException error) {
            throw new IllegalStateException("MEDIA_ROOT klasörü oluşturulamıyor; disk izinlerini kontrol edin.", error);
        }
        require(Files.isDirectory(root) && Files.isWritable(root), "MEDIA_ROOT yazılabilir bir klasör olmalı.");
    }

    private void validateBootstrap(String prefix, List<String> fields) {
        if (fields.stream().noneMatch(field -> hasText(prefix + field))) {
            return;
        }
        require(fields.stream().allMatch(field -> hasText(prefix + field)), prefix + "kurulum ayarlarının tamamı gerekli.");
        String email = environment.getRequiredProperty(prefix + fields.get(fields.size() - 2));
        String password = environment.getRequiredProperty(prefix + fields.getLast());
        require(!email.toLowerCase(Locale.ROOT).endsWith(".local"), "Production kurulumunda gerçek bir e-posta kullanın.");
        require(password.length() >= 16, "Production kurulum şifresi en az 16 karakter olmalı.");
    }

    private boolean databaseUserBypassesRowSecurity() {
        return jdbc.sql("select rolsuper or rolbypassrls from pg_roles where rolname = session_user")
            .query(Boolean.class).single();
    }

    private boolean hasText(String key) {
        return !environment.getProperty(key, "").isBlank();
    }

    private boolean enabled(String key) {
        return environment.getProperty(key, Boolean.class, false);
    }

    private void require(boolean condition, String message) {
        if (!condition) {
            throw new IllegalStateException(message);
        }
    }
}
