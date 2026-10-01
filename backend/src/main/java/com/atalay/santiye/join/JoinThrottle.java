package com.atalay.santiye.join;

import com.atalay.santiye.common.error.ApiException;
import com.atalay.santiye.common.web.AttemptCounter;
import java.time.Clock;
import java.time.Duration;
import org.springframework.stereotype.Component;

/**
 * Katılma oturumsuz bir hesap açar ve bağlantı WhatsApp gruplarında dolaşır: bağlantıyı ele geçiren biri betikle
 * paketin kişi sınırı dolana kadar sahte hesap açıp her şantiyenin akışına "katıldı" satırı yağdırabilirdi. Sınır
 * bağlantı ve adres başınadır: mobil operatörler birçok aboneyi tek IPv4 adresinin arkasına koyar, başka firmaların
 * katılımları birbirinin hakkını yemez. Şantiyenin Wi-Fi'ından aynı saatte katılan kalabalık bir ekip de takılmaz.
 */
@Component
class JoinThrottle {

    private static final int LIMIT = 60;
    private static final Duration WINDOW = Duration.ofHours(1);

    private final AttemptCounter joins;

    JoinThrottle(Clock clock) {
        this.joins = new AttemptCounter(LIMIT, WINDOW, clock);
    }

    void check(String token, String address) {
        String key = token + "|" + address;
        if (joins.isExhausted(key)) {
            throw ApiException.tooManyRequests("Bu bağlantıyla kısa sürede çok fazla katılım denendi. Biraz sonra "
                + "tekrar dene.");
        }
        joins.record(key);
    }
}
