package com.atalay.santiye.support;

import static org.assertj.core.api.Assertions.assertThat;

import com.jayway.jsonpath.JsonPath;
import jakarta.servlet.http.Cookie;
import java.nio.charset.StandardCharsets;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.assertj.MockMvcTester;
import org.springframework.test.web.servlet.assertj.MvcTestResult;

/** Testlerde tekrar eden adımlar: giriş yapmak, firmanın bağlantısıyla katılmak, giriş linkini açmak. */
public abstract class ApiTestSupport {

    protected static final String OWNER_EMAIL = "patron@kizilkan.local";
    protected static final String OWNER_PASSWORD = "patron123";
    protected static final String SESSION_COOKIE = "ks_session";

    @Autowired
    protected MockMvcTester mvc;

    protected MvcTestResult postJson(String uri, Cookie session, String json) {
        var request = mvc.post().uri(uri).contentType(MediaType.APPLICATION_JSON).content(json);
        return session == null ? request.exchange() : request.cookie(session).exchange();
    }

    protected MvcTestResult patchJson(String uri, Cookie session, String json) {
        return mvc.patch().uri(uri).cookie(session).contentType(MediaType.APPLICATION_JSON).content(json).exchange();
    }

    protected MvcTestResult putJson(String uri, Cookie session, String json) {
        return mvc.put().uri(uri).cookie(session).contentType(MediaType.APPLICATION_JSON).content(json).exchange();
    }

    protected MvcTestResult delete(String uri, Cookie session) {
        return mvc.delete().uri(uri).cookie(session).exchange();
    }

    protected MvcTestResult get(String uri, Cookie session) {
        return session == null ? mvc.get().uri(uri).exchange() : mvc.get().uri(uri).cookie(session).exchange();
    }

    protected Cookie loginAsOwner() {
        String json = "{\"email\": \"%s\", \"password\": \"%s\"}".formatted(OWNER_EMAIL, OWNER_PASSWORD);
        return sessionCookieOf(postJson("/api/auth/login", null, json));
    }

    /** Patronun WhatsApp grubuna attığı firma bağlantısının anahtarı. */
    protected String joinToken(Cookie owner) {
        String url = read(contentOf(get("/api/company/join-link", owner)), "$.url");
        return url.substring(url.lastIndexOf('/') + 1);
    }

    /** Bağlantıyı açan kişi adını ve numarasını yazıp katılır; session doluysa bu telefonda zaten içerideydi. */
    protected MvcTestResult join(String token, Cookie session, String fullName, String phone) {
        String json = "{\"fullName\": \"%s\", \"phone\": \"%s\"}".formatted(fullName, phone);
        return postJson("/api/join/" + token, session, json);
    }

    protected String userIdOf(Cookie session) {
        return read(contentOf(get("/api/auth/me", session)), "$.id");
    }

    /** Patron şantiye açar; şantiyenin kimliğini döner. */
    protected String createSite(Cookie owner, String name) {
        MvcTestResult result = postJson("/api/sites", owner, "{\"name\": \"%s\"}".formatted(name));
        assertThat(result).hasStatus(201);
        return read(contentOf(result), "$.id");
    }

    /**
     * Firmanın bağlantısıyla katılıp (çalışan olarak gelir) patronun şef yaptığı, oturumu açık biri: "şefin
     * telefonu". Her şantiyeyi görür.
     */
    protected Cookie signedInLead(Cookie owner, String fullName) {
        return signedInAs(owner, fullName, "SITE_LEAD");
    }

    /** Aynı yoldan gelip patronun depo sorumlusu yaptığı biri: "depocunun telefonu". İmalatı görür, girmez. */
    protected Cookie signedInStorekeeper(Cookie owner, String fullName) {
        return signedInAs(owner, fullName, "STOREKEEPER");
    }

    private Cookie signedInAs(Cookie owner, String fullName, String role) {
        String phone = uniquePhone();
        Cookie member = sessionCookieOf(join(joinToken(owner), null, fullName, phone));
        String promotion = "{\"fullName\": \"%s\", \"phone\": \"%s\", \"role\": \"%s\", \"active\": true}"
            .formatted(fullName, phone, role);
        assertThat(patchJson("/api/team/members/" + userIdOf(member), owner, promotion)).hasStatus(200);
        return member;
    }

    /** Telefonun yaptığı gibi: gönderi kimliği istemcide üretilir, dosyalar aynı istekte gider. */
    protected MvcTestResult sendPost(Cookie session, PostDraft draft, MockMultipartFile... files) {
        var request = mvc.post().uri("/api/posts").multipart().cookie(session)
            .param("id", draft.id()).param("siteId", draft.siteId()).param("issue", "false");
        if (draft.body() != null) {
            request.param("body", draft.body());
        }
        for (MockMultipartFile file : files) {
            request.file(file);
        }
        return request.exchange();
    }

    /** Telefon zorunlu ve ekipte tekildir; testler aynı veritabanını paylaştığı için her kişiye rastgele numara. */
    protected static String uniquePhone() {
        return "05%09d".formatted(java.util.concurrent.ThreadLocalRandom.current().nextInt(1_000_000_000));
    }

    protected MvcTestResult acceptInvite(String inviteUrl) {
        String token = inviteUrl.substring(inviteUrl.lastIndexOf('/') + 1);
        return postJson("/api/auth/invites/accept", null, "{\"token\": \"%s\"}".formatted(token));
    }

    protected Cookie sessionCookieOf(MvcTestResult result) {
        assertThat(result).hasStatusOk();
        return result.getResponse().getCookie(SESSION_COOKIE);
    }

    protected static String contentOf(MvcTestResult result) {
        return new String(result.getResponse().getContentAsByteArray(), StandardCharsets.UTF_8);
    }

    protected static String read(String json, String path) {
        return JsonPath.read(json, path);
    }
}
