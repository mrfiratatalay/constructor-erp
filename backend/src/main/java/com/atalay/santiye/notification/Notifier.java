package com.atalay.santiye.notification;

import java.time.Clock;
import java.util.Collection;
import java.util.UUID;
import org.springframework.stereotype.Service;

/** Bildirimi kaydeder ve kişilerin bütün cihazlarını dürter. Ölü abonelikler temizlenir. */
@Service
public class Notifier {

    private final NotificationRepository notifications;
    private final PushSubscriptionRepository subscriptions;
    private final WebPushSender sender;
    private final Clock clock;

    Notifier(NotificationRepository notifications, PushSubscriptionRepository subscriptions, WebPushSender sender,
        Clock clock) {
        this.notifications = notifications;
        this.subscriptions = subscriptions;
        this.sender = sender;
        this.clock = clock;
    }

    public void deliver(Collection<UUID> userIds, NotificationContent content) {
        if (userIds.isEmpty()) {
            return;
        }
        notifications.saveAll(userIds.stream().map(userId -> new Notification(userId, content, clock.instant())).toList());
        for (PushSubscription subscription : subscriptions.findByUserIdIn(userIds)) {
            if (!sender.send(subscription.endpoint())) {
                subscriptions.deleteByEndpoint(subscription.endpoint());
            }
        }
    }
}
