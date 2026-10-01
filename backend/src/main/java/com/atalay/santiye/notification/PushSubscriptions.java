package com.atalay.santiye.notification;

import com.atalay.santiye.common.error.ApiException;
import java.time.Clock;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Bir kişinin bildirim alan cihazları: yalnızca push servislerinin adresleri kaydedilir (PushEndpoints). */
@Service
public class PushSubscriptions {

    private final PushSubscriptionRepository subscriptions;
    private final Clock clock;

    PushSubscriptions(PushSubscriptionRepository subscriptions, Clock clock) {
        this.subscriptions = subscriptions;
        this.clock = clock;
    }

    /** Aynı cihaz tekrar abone olursa yeni kayıt açılmaz; cihaz artık bu kişiye bildirim alır. */
    @Transactional
    public void subscribe(UUID userId, String endpoint) {
        if (!PushEndpoints.isAllowed(endpoint)) {
            throw ApiException.badRequest("Bu bildirim adresi desteklenmiyor.");
        }
        subscriptions.findByEndpoint(endpoint).ifPresentOrElse(
            existing -> existing.assignTo(userId),
            () -> subscriptions.save(new PushSubscription(userId, endpoint, clock.instant())));
    }

    /** Yalnızca kişinin kendi aboneliği silinir: başkasının cihaz adresini bilen onun bildirimlerini kapatamaz. */
    @Transactional
    public void unsubscribe(UUID userId, String endpoint) {
        subscriptions.deleteByEndpointAndUserId(endpoint, userId);
    }
}
