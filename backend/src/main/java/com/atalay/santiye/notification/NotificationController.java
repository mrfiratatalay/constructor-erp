package com.atalay.santiye.notification;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.notification.dto.NotificationView;
import com.atalay.santiye.notification.dto.PushPublicKey;
import com.atalay.santiye.notification.dto.PushSubscribeRequest;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.time.Clock;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/notifications")
@Tag(name = "Notifications")
public class NotificationController {

    private final VapidKeys keys;
    private final PushSubscriptionRepository subscriptions;
    private final NotificationRepository notifications;
    private final Clock clock;

    NotificationController(VapidKeys keys, PushSubscriptionRepository subscriptions,
        NotificationRepository notifications, Clock clock) {
        this.keys = keys;
        this.subscriptions = subscriptions;
        this.notifications = notifications;
        this.clock = clock;
    }

    @GetMapping("/push-key")
    public PushPublicKey getPushKey() {
        return new PushPublicKey(keys.publicKey());
    }

    /** Aynı cihaz tekrar abone olursa yeni kayıt açılmaz; cihaz artık bu kişiye bildirim alır. */
    @PostMapping("/subscriptions")
    @Transactional
    public void subscribePush(@AuthenticationPrincipal CurrentUser user, @Valid @RequestBody PushSubscribeRequest request) {
        subscriptions.findByEndpoint(request.endpoint()).ifPresentOrElse(
            existing -> existing.assignTo(user.userId()),
            () -> subscriptions.save(new PushSubscription(user.userId(), request.endpoint(), clock.instant())));
    }

    @DeleteMapping("/subscriptions")
    public void unsubscribePush(@Valid @RequestBody PushSubscribeRequest request) {
        subscriptions.deleteByEndpoint(request.endpoint());
    }

    /** Telefon dürtülünce bunu okur ve gösterir. Hiç bildirim yoksa 204. */
    @GetMapping("/latest")
    public ResponseEntity<NotificationView> getLatestNotification(@AuthenticationPrincipal CurrentUser user) {
        return notifications.findFirstByUserIdOrderByCreatedAtDesc(user.userId())
            .map(n -> new NotificationView(n.getId(), n.getTitle(), n.getBody(), n.getUrl(), n.getCreatedAt()))
            .map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.noContent().build());
    }
}
