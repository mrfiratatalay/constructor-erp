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

    /** Çıkarılan saha hesabı numarasıyla geri gelir (TeamMembersTest); şifreyle giren biri bu yoldan devralınmaz. */
    @Test
    void theJoinLinkNeverHandsOverSomeoneWhoSignsInWithAPassword() {
        String email = uniqueEmail();
        Tenant first = createTenantOwnedBy(email, PASSWORD);
        createTenantOwnedBy(email, PASSWORD);
        Cookie coOwner = signedInAs(first.owner(), "Ortak Patron", "OWNER");
        String victim = userIdOf(first.owner());
        String phone = uniquePhone();
        assertThat(patchJson("/api/team/members/" + victim, first.owner(), owner(phone, true))).hasStatusOk();
        assertThat(patchJson("/api/team/members/" + victim, coOwner, owner(phone, false))).hasStatusOk();

        assertThat(join(joinToken(coOwner), null, "Numarayı Bilen", phone)).hasStatus(400);
        assertThat(login(email, PASSWORD)).hasStatusOk();
    }

    /** Ad kimliğindir ve öbür firmada da görünür: başkası değiştiremez, kişi kendisi değiştirir. */
    @Test
    void onlyThePersonRenamesAnAccountTheyShareWithAnotherCompany() {
        String email = uniqueEmail();
        Tenant first = createTenantOwnedBy(email, PASSWORD);
        Tenant second = createTenantOwnedBy(email, PASSWORD);
        Cookie coOwner = signedInAs(first.owner(), "Ortak Patron", "OWNER");
        String person = userIdOf(first.owner());
        String renamed = "{\"fullName\": \"Başka Ad\", \"role\": \"OWNER\", \"active\": true}";

        assertThat(patchJson("/api/team/members/" + person, coOwner, renamed)).hasStatus(400);
        assertThat(patchJson("/api/team/members/" + person, first.owner(), renamed)).hasStatusOk();
        assertThat(get("/api/auth/me", second.owner())).bodyJson().extractingPath("$.fullName").isEqualTo("Başka Ad");
    }

    private static String owner(String phone, boolean active) {
        return "{\"fullName\": \"Çok Firmalı Patron\", \"phone\": \"%s\", \"role\": \"OWNER\", \"active\": %s}"
            .formatted(phone, active);
    }
}
