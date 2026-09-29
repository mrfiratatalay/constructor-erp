package com.atalay.santiye.billing;

import jakarta.annotation.Nullable;
import java.time.LocalDate;
import java.util.Set;
import java.util.UUID;

/**
 * Firmanın çalışma alanının bugünkü hâli: açık mı (değilse neden), paketin açtığı modüller, geçerli dönemin bitişi.
 * Kilitliyken de paket bilgisi durur: kilit ekranı "Professional aboneliğiniz 3 Ekim'de bitti" diyebilsin.
 */
public record WorkspaceStatus(
    UUID companyId,
    boolean open,
    @Nullable LockReason lockReason,
    Set<String> features,
    @Nullable String planName,
    @Nullable LocalDate endsOn,
    @Nullable SubscriptionState subscriptionState) {
}
