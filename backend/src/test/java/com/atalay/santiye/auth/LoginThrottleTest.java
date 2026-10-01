package com.atalay.santiye.auth;

import static org.assertj.core.api.Assertions.assertThat;

import com.atalay.santiye.support.IntegrationTest;
import com.atalay.santiye.support.TenantTestSupport;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.assertj.MvcTestResult;

/** Şifreyle giriş kaba kuvvete kapalı: çok hatalı deneme bir süre bekletilir (LoginAttempts). */
@IntegrationTest
class LoginThrottleTest extends TenantTestSupport {

    private static final String PASSWORD = "Dogru-Sifre-77";

    /** Tek hesaba çok yerden şifre denemek: onuncu hatadan sonra doğru şifre bile beklemek zorunda. */
    @Test
    void anAccountIsShieldedAfterTenWrongPasswords() {
        String email = uniqueEmail();
        createTenantOwnedBy(email, PASSWORD);
        for (int attempt = 0; attempt < 10; attempt++) {
            assertThat(loginFrom("203.0.113." + attempt, email, "yanlis-" + attempt)).hasStatus(401);
        }

        assertThat(loginFrom("203.0.113.200", email, PASSWORD)).hasStatus(429);
    }

    /** Tek yerden çok hesap denemek: yirminci hatadan sonra bu adres bekler, başka adres beklemez. */
    @Test
    void anAddressIsStoppedAfterTwentyWrongPasswords() {
        for (int attempt = 0; attempt < 20; attempt++) {
            assertThat(loginFrom("198.51.100.99", uniqueEmail(), "yanlis")).hasStatus(401);
        }

        assertThat(loginFrom("198.51.100.99", uniqueEmail(), "yanlis")).hasStatus(429);
        assertThat(loginFrom("198.51.100.100", uniqueEmail(), "yanlis")).hasStatus(401);
    }

    @Test
    void aSuccessfulLoginForgetsEarlierMistakes() {
        String email = uniqueEmail();
        createTenantOwnedBy(email, PASSWORD);
        for (int attempt = 0; attempt < 9; attempt++) {
            assertThat(loginFrom("192.0.2." + attempt, email, "yanlis")).hasStatus(401);
        }
        assertThat(loginFrom("192.0.2.50", email, PASSWORD)).hasStatusOk();

        for (int attempt = 0; attempt < 9; attempt++) {
            assertThat(loginFrom("192.0.2." + (100 + attempt), email, "yanlis")).hasStatus(401);
        }
        assertThat(loginFrom("192.0.2.200", email, PASSWORD)).hasStatusOk();
    }

    private MvcTestResult loginFrom(String address, String email, String password) {
        return mvc.post().uri("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
            .content("{\"email\": \"%s\", \"password\": \"%s\"}".formatted(email, password))
            .with(request -> {
                request.setRemoteAddr(address);
                return request;
            })
            .exchange();
    }
}
