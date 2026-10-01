package com.atalay.santiye.auth;

import com.atalay.santiye.common.error.ApiException;
import com.atalay.santiye.common.web.AttemptCounter;
import java.time.Clock;
import java.time.Duration;
import org.springframework.stereotype.Component;

/**
 * Şifreyle girişte kaba kuvvete karşı sınır: aynı adresten 15 dakikada 20, aynı e-postaya 15 dakikada 10 hatalı
 * deneme. Adres sınırı tek yerden çok hesabın, e-posta sınırı tek hesabın çok yerden denenmesini durdurur. Başarılı
 * giriş e-postanın sayacını sıfırlar (bir kez yanlış yazan beklemesin); adresinkini sıfırlamaz, yoksa arada kendi
 * hesabıyla giren biri sınırı hiç görmezdi.
 */
@Component
class LoginAttempts {

    private static final Duration WINDOW = Duration.ofMinutes(15);
    private static final int PER_ADDRESS = 20;
    private static final int PER_EMAIL = 10;

    private final AttemptCounter byAddress;
    private final AttemptCounter byEmail;

    LoginAttempts(Clock clock) {
        this.byAddress = new AttemptCounter(PER_ADDRESS, WINDOW, clock);
        this.byEmail = new AttemptCounter(PER_EMAIL, WINDOW, clock);
    }

    void requireAllowed(String address, String email) {
        if (byAddress.isExhausted(address) || byEmail.isExhausted(email)) {
            throw ApiException.tooManyRequests("Çok fazla hatalı deneme. 15 dakika sonra tekrar dene.");
        }
    }

    void failed(String address, String email) {
        byAddress.record(address);
        byEmail.record(email);
    }

    void succeeded(String email) {
        byEmail.clear(email);
    }
}
