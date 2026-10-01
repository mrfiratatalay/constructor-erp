package com.atalay.santiye.notification;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Clock;
import java.time.Duration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * İçeriksiz ("dürtme") Web Push: cihazdaki service worker dürtülünce bildirimin içeriğini sunucudan okur.
 * Böylece yalnızca VAPID imzası gerekir; içerik şifrelemesi (RFC 8291) ve ek kütüphane gerekmez.
 */
@Component
class WebPushSender {

    private static final Logger log = LoggerFactory.getLogger(WebPushSender.class);
    private static final Duration TIME_TO_LIVE = Duration.ofDays(1);
    private static final Duration TOKEN_LIFETIME = Duration.ofHours(12);

    private final HttpClient http = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(10)).build();
    private final VapidKeys keys;
    private final PushProperties properties;
    private final Clock clock;

    WebPushSender(VapidKeys keys, PushProperties properties, Clock clock) {
        this.keys = keys;
        this.properties = properties;
        this.clock = clock;
    }

    /**
     * false: abonelik artık geçersiz (uygulama silinmiş ya da izin kaldırılmış), silinmeli. Push servisi olmayan bir
     * adrese (bu kural gelmeden kaydedilmiş olabilir) hiç istek atılmaz; o kayıt da silinir.
     */
    boolean send(String endpoint) {
        if (!PushEndpoints.isAllowed(endpoint)) {
            log.warn("Push servisi olmayan bildirim adresi silindi: {}", endpoint);
            return false;
        }
        try {
            HttpResponse<Void> response = http.send(request(endpoint), HttpResponse.BodyHandlers.discarding());
            int status = response.statusCode();
            if (status >= 400 && status != 404 && status != 410) {
                log.warn("Web Push reddedildi ({}): {}", status, endpoint);
            }
            return status != 404 && status != 410;
        } catch (IOException | InterruptedException error) {
            log.warn("Web Push gönderilemedi: {}", endpoint, error);
            return true;
        }
    }

    private HttpRequest request(String endpoint) {
        URI uri = URI.create(endpoint);
        String audience = uri.getScheme() + "://" + uri.getHost();
        String token = VapidJwt.sign(audience, properties.subject(), keys.privateKey(), clock.instant().plus(TOKEN_LIFETIME));
        return HttpRequest.newBuilder(uri)
            .timeout(Duration.ofSeconds(15))
            .header("TTL", String.valueOf(TIME_TO_LIVE.toSeconds()))
            .header("Urgency", "high")
            .header("Authorization", "vapid t=" + token + ", k=" + keys.publicKey())
            .POST(HttpRequest.BodyPublishers.noBody())
            .build();
    }
}
