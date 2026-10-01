package com.atalay.santiye.auth;

import com.atalay.santiye.user.AppUser;
import jakarta.annotation.Nullable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Şifre karşılaştırması, hesap olsa da olmasa da aynı sürede: e-posta kayıtlı değilse (ya da hesabın şifresi yoksa)
 * şifre sahte bir özetle karşılaştırılır. Yoksa bcrypt'in süresi yalnızca kayıtlı e-postalarda harcanır ve yanıtın
 * ne kadar sürdüğünden hangi e-postanın kayıtlı olduğu anlaşılırdı; aynı hata mesajı da bir işe yaramazdı.
 */
@Component
class PasswordCheck {

    private final PasswordEncoder encoder;
    private final String decoy;

    PasswordCheck(PasswordEncoder encoder) {
        this.encoder = encoder;
        this.decoy = encoder.encode(SecureTokens.generate());
    }

    boolean matches(@Nullable AppUser user, String password) {
        if (user == null || !user.canLoginWithPassword()) {
            encoder.matches(password, decoy);
            return false;
        }
        return encoder.matches(password, user.getPasswordHash());
    }
}
