package com.atalay.santiye.join;

import com.atalay.santiye.user.AppUser;
import jakarta.annotation.Nullable;
import java.util.UUID;

/**
 * Katılmanın sonucu. newcomer doluysa bu cihazda oturum yoktu: controller ona oturum açar. Boşsa kişi zaten
 * firmadaydı: açık oturumu bu firmaya geçer.
 */
record Joined(@Nullable AppUser newcomer, UUID companyId) {
}
