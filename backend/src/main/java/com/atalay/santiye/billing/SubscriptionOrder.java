package com.atalay.santiye.billing;

import java.time.LocalDate;
import java.util.UUID;

/** Başlatılacak ya da uzatılacak dönem: paket, ay sayısı, (açık dönem yoksa) başlangıç günü ve kısa not. */
public record SubscriptionOrder(UUID planId, int months, LocalDate startsOn, String note) {
}
