package com.atalay.santiye.notification;

import static org.assertj.core.api.Assertions.assertThat;

import com.atalay.santiye.support.ApiTestSupport;
import com.atalay.santiye.support.IntegrationTest;
import jakarta.servlet.http.Cookie;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.assertj.MvcTestResult;

/**
 * Bildirim aboneliği. Hesaplar şef: bildirimler patronlara gider, testte kaydedilen adreslere hiç istek atılmaz.
 */
@IntegrationTest
class PushSubscriptionFlowTest extends ApiTestSupport {

    @Autowired
    private PushSubscriptionRepository subscriptions;

    @Test
    void theServerOnlyStoresBrowserPushAddresses() {
        Cookie lead = signedInLead(loginAsOwner(), "Bildirimli Şef");

        assertThat(subscribe(lead, "https://169.254.169.254/latest/meta-data")).hasStatus(400);
        assertThat(subscribe(lead, "https://fcm.googleapis.com/fcm/send/" + UUID.randomUUID())).hasStatusOk();
    }

    @Test
    void someoneElseCannotRemoveMyDevice() {
        Cookie owner = loginAsOwner();
        Cookie mine = signedInLead(owner, "Cihazlı Şef");
        Cookie other = signedInLead(owner, "Meraklı Şef");
        String endpoint = "https://fcm.googleapis.com/fcm/send/" + UUID.randomUUID();
        assertThat(subscribe(mine, endpoint)).hasStatusOk();

        assertThat(unsubscribe(other, endpoint)).hasStatusOk();
        assertThat(subscriptions.findByEndpoint(endpoint)).isPresent();

        assertThat(unsubscribe(mine, endpoint)).hasStatusOk();
        assertThat(subscriptions.findByEndpoint(endpoint)).isEmpty();
    }

    private MvcTestResult subscribe(Cookie session, String endpoint) {
        return postJson("/api/notifications/subscriptions", session, body(endpoint));
    }

    private MvcTestResult unsubscribe(Cookie session, String endpoint) {
        return mvc.delete().uri("/api/notifications/subscriptions").cookie(session)
            .contentType(MediaType.APPLICATION_JSON).content(body(endpoint)).exchange();
    }

    private static String body(String endpoint) {
        return "{\"endpoint\": \"%s\"}".formatted(endpoint);
    }
}
