package com.atalay.santiye.support;

import static org.assertj.core.api.Assertions.assertThat;

import com.jayway.jsonpath.JsonPath;
import jakarta.servlet.http.Cookie;
import java.util.List;
import java.util.UUID;
import org.springframework.test.web.servlet.assertj.MvcTestResult;

/**
 * Birden çok firmalı senaryolar: platform yöneticisi firma açar, kurulum linkini patron tamamlar. Aynı e-postayla
 * kurulan ikinci firmada aynı kişi (aynı kimlik) patron olur; bir kişi birden çok firmada böyle bulunur.
 */
public abstract class TenantTestSupport extends ApiTestSupport {

    private static final String ADMIN_EMAIL = "admin@constructor-erp.local";
    private static final String ADMIN_PASSWORD = "admin123";

    /** Kurulan firma ve patronunun o firmada açılan oturumu. */
    protected record Tenant(String companyId, Cookie owner) {
    }

    /** Platformun açtığı, kurulumu henüz yapılmamış firma ve kurulum linkinin anahtarı. */
    protected record OpenedTenant(String companyId, String setupToken) {
    }

    protected MvcTestResult login(String email, String password) {
        return postJson("/api/auth/login", null,
            "{\"email\": \"%s\", \"password\": \"%s\"}".formatted(email, password));
    }

    protected Cookie loginAsPlatformAdmin() {
        return sessionCookieOf(login(ADMIN_EMAIL, ADMIN_PASSWORD));
    }

    protected OpenedTenant openTenant() {
        Cookie admin = loginAsPlatformAdmin();
        String tenant = "{\"name\": \"Firma %s\", \"planId\": \"%s\", \"months\": 12}"
            .formatted(UUID.randomUUID(), professionalPlan(admin));
        MvcTestResult created = postJson("/api/platform/tenants", admin, tenant);
        assertThat(created).hasStatus(201);
        String url = read(contentOf(created), "$.invite.url");
        return new OpenedTenant(read(contentOf(created), "$.companyId"), url.substring(url.lastIndexOf('/') + 1));
    }

    protected MvcTestResult completeSetup(String setupToken, String email, String password) {
        String setup = """
            {"company": {"name": "Kurulan Firma"},
             "owner": {"fullName": "Çok Firmalı Patron", "email": "%s", "password": "%s"}}""".formatted(email, password);
        return postJson("/api/setup/" + setupToken, null, setup);
    }

    protected Tenant createTenantOwnedBy(String email, String password) {
        OpenedTenant opened = openTenant();
        return new Tenant(opened.companyId(), sessionCookieOf(completeSetup(opened.setupToken(), email, password)));
    }

    protected static String uniqueEmail() {
        return "patron-" + UUID.randomUUID() + "@test.local";
    }

    private String professionalPlan(Cookie admin) {
        List<String> ids = JsonPath.read(contentOf(get("/api/platform/plans", admin)), "$[?(@.code == 'professional')].id");
        return ids.getFirst();
    }
}
