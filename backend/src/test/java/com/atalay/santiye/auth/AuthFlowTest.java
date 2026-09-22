package com.atalay.santiye.auth;

import static org.assertj.core.api.Assertions.assertThat;

import com.atalay.santiye.support.ApiTestSupport;
import com.atalay.santiye.support.IntegrationTest;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpHeaders;
import org.springframework.test.web.servlet.assertj.MvcTestResult;

@IntegrationTest
class AuthFlowTest extends ApiTestSupport {

    @Test
    void ownerLogsInWithAHardenedCookie() {
        String json = "{\"email\": \"%s\", \"password\": \"%s\"}".formatted(OWNER_EMAIL, OWNER_PASSWORD);
        MvcTestResult login = postJson("/api/auth/login", null, json);

        assertThat(login).hasStatusOk();
        assertThat(login.getResponse().getHeader(HttpHeaders.SET_COOKIE))
            .contains("HttpOnly", "SameSite=Strict", "Path=/api");
        assertThat(get("/api/auth/me", sessionCookieOf(login))).bodyJson()
            .extractingPath("$.role").isEqualTo("OWNER");
    }

    @Test
    void wrongPasswordAndUnknownEmailGetTheSameAnswer() {
        MvcTestResult wrongPassword = postJson("/api/auth/login", null,
            "{\"email\": \"%s\", \"password\": \"yanlis\"}".formatted(OWNER_EMAIL));
        MvcTestResult unknownEmail = postJson("/api/auth/login", null,
            "{\"email\": \"yok@kizilkan.local\", \"password\": \"yanlis\"}");

        assertThat(wrongPassword).hasStatus(401).bodyJson().extractingPath("$.detail")
            .isEqualTo("E-posta ya da şifre hatalı.");
        assertThat(unknownEmail).hasStatus(401).bodyJson().extractingPath("$.detail")
            .isEqualTo("E-posta ya da şifre hatalı.");
    }

    @Test
    void apiIsClosedWithoutASession() {
        assertThat(get("/api/auth/me", null)).hasStatus(401);
        assertThat(get("/api/auth/me", new Cookie(SESSION_COOKIE, "uydurma-token"))).hasStatus(401);
    }

    @Test
    void logoutEndsTheSessionOnTheServer() {
        Cookie session = loginAsOwner();

        MvcTestResult logout = mvc.post().uri("/api/auth/logout").cookie(session).exchange();

        assertThat(logout).hasStatus(204);
        assertThat(logout.getResponse().getHeader(HttpHeaders.SET_COOKIE)).contains("Max-Age=0");
        assertThat(get("/api/auth/me", session)).hasStatus(401);
    }
}
