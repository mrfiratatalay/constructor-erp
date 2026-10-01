package com.atalay.santiye.common;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.RETURNS_DEEP_STUBS;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.atalay.santiye.user.PlatformRole;
import com.atalay.santiye.user.UserRepository;
import java.nio.file.Path;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.mock.env.MockEnvironment;

/** Üretimde veritabanı kullanıcısı firma ayrımını (RLS) aşabiliyorsa sunucu açılmaz. */
class ProductionSettingsAuditTest {

    @TempDir
    private Path media;

    private final UserRepository users = mock(UserRepository.class);
    private final JdbcClient jdbc = mock(JdbcClient.class, RETURNS_DEEP_STUBS);

    @Test
    void aDatabaseUserThatBypassesRowSecurityStopsTheServer() {
        when(jdbc.sql(anyString()).query(Boolean.class).single()).thenReturn(true);

        assertThatThrownBy(() -> audit().run(null)).isInstanceOf(IllegalStateException.class)
            .hasMessageContaining("süper kullanıcı olmamalı");
    }

    @Test
    void anOrdinaryDatabaseUserIsAccepted() {
        when(jdbc.sql(anyString()).query(Boolean.class).single()).thenReturn(false);

        assertThatCode(() -> audit().run(null)).doesNotThrowAnyException();
    }

    private ProductionSettingsAudit audit() {
        when(users.existsByPlatformRole(PlatformRole.SUPER_ADMIN)).thenReturn(true);
        MockEnvironment environment = new MockEnvironment()
            .withProperty("app.session.secure-cookie", "true")
            .withProperty("spring.flyway.clean-disabled", "true")
            .withProperty("app.invite.base-url", "https://ornek.vercel.app")
            .withProperty("app.media.root", media.toAbsolutePath().toString());
        return new ProductionSettingsAudit(environment, users, jdbc);
    }
}
