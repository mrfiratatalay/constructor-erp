package com.atalay.santiye.platform;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.atalay.santiye.user.AppUser;
import com.atalay.santiye.user.PlatformRole;
import com.atalay.santiye.user.UserRepository;
import java.time.Clock;
import java.time.Instant;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;

/** Hiç süper yönetici yokken açılış: ayardaki e-postayı önceden alan biri yönetici yapılmaz. */
class PlatformAdminBootstrapTest {

    private static final String EMAIL = "admin@ornek.local";
    private static final String PASSWORD = "Ayar-Sifresi-71";

    private final UserRepository users = mock(UserRepository.class);
    private final PasswordEncoder encoder = PasswordEncoderFactories.createDelegatingPasswordEncoder();
    private final PlatformAdminBootstrap bootstrap = new PlatformAdminBootstrap(
        new PlatformAdminProperties("Destek", EMAIL, PASSWORD), users, encoder, Clock.systemUTC());

    @BeforeEach
    void noSuperAdminYet() {
        when(users.existsByPlatformRole(PlatformRole.SUPER_ADMIN)).thenReturn(false);
    }

    @Test
    void anAccountSomeoneElseOpenedWithThatEmailIsNotPromoted() {
        AppUser stranger = accountWith("baska-bir-sifre");

        bootstrap.run(null);

        assertThat(stranger.isPlatformAdmin()).isFalse();
        verify(users, never()).save(any());
    }

    @Test
    void theOperatorsOwnAccountIsPromoted() {
        AppUser operator = accountWith(PASSWORD);

        bootstrap.run(null);

        assertThat(operator.isPlatformAdmin()).isTrue();
    }

    @Test
    void withoutAnAccountANewAdminIsOpened() {
        when(users.findByEmailIgnoreCase(EMAIL)).thenReturn(Optional.empty());
        ArgumentCaptor<AppUser> saved = ArgumentCaptor.forClass(AppUser.class);

        bootstrap.run(null);

        verify(users).save(saved.capture());
        assertThat(saved.getValue().isPlatformAdmin()).isTrue();
        assertThat(encoder.matches(PASSWORD, saved.getValue().getPasswordHash())).isTrue();
    }

    private AppUser accountWith(String password) {
        AppUser account = new AppUser("Hesap", Instant.now());
        account.setPasswordLogin(EMAIL, encoder.encode(password));
        when(users.findByEmailIgnoreCase(EMAIL)).thenReturn(Optional.of(account));
        return account;
    }
}
