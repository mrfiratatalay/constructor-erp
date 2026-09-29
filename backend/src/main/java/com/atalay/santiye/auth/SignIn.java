package com.atalay.santiye.auth;

import com.atalay.santiye.user.AppUser;
import jakarta.annotation.Nullable;
import java.util.UUID;

/** Oturum açılacak kişi ve oturumun hangi firmada başlayacağı; firmasız platform yöneticisinde companyId boştur. */
public record SignIn(AppUser user, @Nullable UUID companyId) {
}
