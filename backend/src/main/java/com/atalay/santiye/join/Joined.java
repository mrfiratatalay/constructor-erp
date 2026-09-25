package com.atalay.santiye.join;

import com.atalay.santiye.user.AppUser;
import jakarta.annotation.Nullable;

/** Katılmanın sonucu. newcomer doluysa bu cihazda oturum yoktu: controller ona oturum açar. */
record Joined(@Nullable AppUser newcomer) {
}
