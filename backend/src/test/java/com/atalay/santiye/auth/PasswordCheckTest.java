package com.atalay.santiye.auth;

import static org.assertj.core.api.Assertions.assertThat;

import com.atalay.santiye.user.AppUser;
import java.time.Instant;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.password.PasswordEncoder;

/** Kayıtlı olmayan e-posta da bir şifre karşılaştırmasına mal olur: yanıt süresi e-postayı ele vermez. */
class PasswordCheckTest {

    /** bcrypt yerine karşılaştırmaları sayan bir kodlayıcı. */
    private static final class CountingEncoder implements PasswordEncoder {

        private int comparisons;

        @Override
        public String encode(CharSequence raw) {
            return "hash:" + raw;
        }

        @Override
        public boolean matches(CharSequence raw, String encoded) {
            comparisons++;
            return encoded.equals("hash:" + raw);
        }
    }

    private final CountingEncoder encoder = new CountingEncoder();
    private final PasswordCheck check = new PasswordCheck(encoder);

    @Test
    void anUnknownAccountStillCostsOneComparison() {
        assertThat(check.matches(null, "herhangi")).isFalse();
        assertThat(encoder.comparisons).isEqualTo(1);
    }

    @Test
    void anAccountWithoutAPasswordStillCostsOneComparison() {
        assertThat(check.matches(new AppUser("Saha Çalışanı", Instant.now()), "herhangi")).isFalse();
        assertThat(encoder.comparisons).isEqualTo(1);
    }

    @Test
    void aKnownAccountIsComparedWithItsOwnHash() {
        AppUser owner = new AppUser("Patron", Instant.now());
        owner.setPasswordLogin("patron@test.local", encoder.encode("dogru"));

        assertThat(check.matches(owner, "dogru")).isTrue();
        assertThat(check.matches(owner, "yanlis")).isFalse();
    }
}
