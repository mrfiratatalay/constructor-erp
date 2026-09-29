package com.atalay.santiye.billing;

import java.time.LocalDate;

/** Yeni dönemin tarihleri; note: "Nakit, 1 ay" gibi platform yönetiminin kısa açıklaması. */
public record SubscriptionPeriod(LocalDate startsOn, LocalDate endsOn, String note) {
}
