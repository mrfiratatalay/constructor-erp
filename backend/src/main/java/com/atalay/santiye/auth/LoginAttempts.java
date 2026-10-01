package com.atalay.santiye.auth;

import com.atalay.santiye.common.error.ApiException;
import com.atalay.santiye.common.web.AttemptCounter;
import java.time.Clock;
import java.time.Duration;
import org.springframework.stereotype.Component;

/**
 * Şifreyle girişte kaba kuvvete karşı sınır, 15 dakikalık pencerelerle. Aynı adresten aynı hesaba 10 hatalı deneme
 * yalnızca o adresi durdurur: hesabın sahibi kendi telefonundan girmeye devam eder, saldırgan onu dışarıda bırakamaz.
 * Aynı adresten 20 hata (çok hesap deneyen) adresi, bir hesaba her yerden toplam 50 hata (dağıtık deneme) hesabı
 * durdurur. Başarılı giriş yalnızca o adres-hesap ikilisini sıfırlar; diğerlerini sıfırlamaz, yoksa arada kendi
 * hesabıyla giren biri sınırı hiç görmezdi.
 */
@Component
class LoginAttempts {

    private static final Duration WINDOW = Duration.ofMinutes(15);
    private static final int PER_ADDRESS_AND_ACCOUNT = 10;
    private static final int PER_ADDRESS = 20;
    private static final int PER_ACCOUNT = 50;

    private final AttemptCounter byPair;
    private final AttemptCounter byAddress;
    private final AttemptCounter byAccount;

    LoginAttempts(Clock clock) {
        this.byPair = new AttemptCounter(PER_ADDRESS_AND_ACCOUNT, WINDOW, clock);
        this.byAddress = new AttemptCounter(PER_ADDRESS, WINDOW, clock);
        this.byAccount = new AttemptCounter(PER_ACCOUNT, WINDOW, clock);
    }

    void requireAllowed(String address, String email) {
        if (byPair.isExhausted(pair(address, email)) || byAddress.isExhausted(address) || byAccount.isExhausted(email)) {
            throw ApiException.tooManyRequests("Çok fazla hatalı deneme. 15 dakika sonra tekrar dene.");
        }
    }

    void failed(String address, String email) {
        byPair.record(pair(address, email));
        byAddress.record(address);
        byAccount.record(email);
    }

    void succeeded(String address, String email) {
        byPair.clear(pair(address, email));
    }

    private static String pair(String address, String email) {
        return address + " " + email;
    }
}
