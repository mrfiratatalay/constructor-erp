package com.atalay.santiye.auth.dto;

import jakarta.annotation.Nullable;
import java.time.LocalDate;

/**
 * Çalışma alanı açık mı; değilse neden (lockReason: WORKSPACE_LOCKED cevabındaki reason ile aynı) ve kullanıcıya
 * gösterilecek mesaj. daysLeft: geçerli dönemin bitişine kalan gün (uyarı bandı için).
 */
public record WorkspaceAccessView(
    boolean open,
    @Nullable String lockReason,
    @Nullable String lockMessage,
    @Nullable String planName,
    @Nullable String subscriptionState,
    @Nullable LocalDate endsOn,
    @Nullable Long daysLeft) {
}
