package com.atalay.santiye.billing;

import java.time.LocalDate;
import java.util.Collection;
import java.util.Comparator;
import java.util.Optional;

/** Bir firmanın dönemlerinden bugünkü dönem: bugünü kapsayan; yoksa en son biten (ya da başlayacak) dönem. */
public final class Periods {

    private Periods() {
    }

    public static Optional<Subscription> current(Collection<Subscription> periods, LocalDate today) {
        return periods.stream()
            .filter(period -> period.getStatus() != SubscriptionStatus.CANCELLED && period.covers(today)).findFirst()
            .or(() -> periods.stream().filter(period -> period.getStatus() != SubscriptionStatus.CANCELLED)
                .max(Comparator.comparing(Subscription::getEndsOn)))
            .or(() -> periods.stream().max(Comparator.comparing(Subscription::getStartsOn)));
    }
}
