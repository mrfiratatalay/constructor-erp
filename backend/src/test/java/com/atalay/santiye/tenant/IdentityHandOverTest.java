package com.atalay.santiye.tenant;

import static org.assertj.core.api.Assertions.assertThat;

import com.atalay.santiye.support.IntegrationTest;
import com.atalay.santiye.support.TenantTestSupport;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.Test;

/**
 * Bir kişi birden çok firmada olabilir: kurulumda var olan hesabın e-postası yazılınca aynı kimlik ikinci firmaya da
 * patron olarak bağlanır. Firmalardan birinin (öbür) patronu bu kimliği devralamaz; devralsaydı kişinin diğer
 * firmasına ya da platform yönetimine de geçerdi.
 */
@IntegrationTest
class IdentityHandOverTest extends TenantTestSupport {

    private static final String PASSWORD = "Saglam-Sifre-42";

    @Test
    void aCoOwnerCannotGetALoginLinkForSomeoneWhoSignsInWithAPassword() {
        String email = uniqueEmail();
        Tenant first = createTenantOwnedBy(email, PASSWORD);
        createTenantOwnedBy(email, PASSWORD);
        Cookie coOwner = signedInAs(first.owner(), "Ortak Patron", "OWNER");

        String victim = userIdOf(first.owner());

        assertThat(postJson("/api/team/members/" + victim + "/login-link", coOwner, "")).hasStatus(400);
    }
}
