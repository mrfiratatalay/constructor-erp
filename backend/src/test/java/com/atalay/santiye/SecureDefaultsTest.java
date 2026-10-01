package com.atalay.santiye;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.assertj.MockMvcTester;
import org.springframework.test.web.servlet.assertj.MvcTestResult;

/**
 * Profil verilmeden açılan sunucu (ör. üretimde profil unutuldu): geliştirmenin hazır hesapları açılmaz, API haritası
 * yayımlanmaz. Bilerek @IntegrationTest değil: o local profili açar.
 */
@SpringBootTest
@AutoConfigureMockMvc
@Import(TestcontainersConfiguration.class)
@TestPropertySource(properties = "app.media.root=${java.io.tmpdir}/santiye-test-media-no-profile")
class SecureDefaultsTest {

    @Autowired
    private MockMvcTester mvc;

    @Test
    void theDevelopmentAccountsDoNotExist() {
        assertThat(login("admin@constructor-erp.local", "admin123")).hasStatus(401);
        assertThat(login("patron@kizilkan.local", "patron123")).hasStatus(401);
    }

    @Test
    void theApiMapIsNotPublished() {
        assertThat(mvc.get().uri("/v3/api-docs").exchange()).hasStatus(404);
    }

    private MvcTestResult login(String email, String password) {
        return mvc.post().uri("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
            .content("{\"email\": \"%s\", \"password\": \"%s\"}".formatted(email, password)).exchange();
    }
}
