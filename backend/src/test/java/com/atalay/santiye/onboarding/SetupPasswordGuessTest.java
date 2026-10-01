package com.atalay.santiye.onboarding;

import static org.assertj.core.api.Assertions.assertThat;

import com.atalay.santiye.support.IntegrationTest;
import com.atalay.santiye.support.TenantTestSupport;
import org.junit.jupiter.api.Test;

/**
 * Kurulum sihirbazı var olan bir hesabın e-postası yazılınca o hesabın şifresini doğrular. Kurulum linki elinde olan
 * biri bunu şifre denemek için kullanamaz: firma başına 15 dakikada on hatalı denemeden sonra bekler.
 */
@IntegrationTest
class SetupPasswordGuessTest extends TenantTestSupport {

    private static final String PASSWORD = "Gercek-Sifre-31";

    @Test
    void guessingAnExistingAccountsPasswordIsStoppedAfterTenTries() {
        String email = uniqueEmail();
        createTenantOwnedBy(email, PASSWORD);
        String token = openTenant().setupToken();
        for (int attempt = 0; attempt < 10; attempt++) {
            assertThat(completeSetup(token, email, "tahmin-" + attempt)).hasStatus(400);
        }

        assertThat(completeSetup(token, email, PASSWORD)).hasStatus(429);
    }
}
