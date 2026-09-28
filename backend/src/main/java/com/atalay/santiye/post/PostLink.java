package com.atalay.santiye.post;

import jakarta.persistence.Embeddable;
import java.util.UUID;

/**
 * Mesajın bağlı olduğu iş: görev kartıysa görev (taskId), iş teslimi ya da şefin cevabıysa teslim (deliveryId).
 * Bağlı mesajın yazısını sunucu koyar, baloncukta işin kartı çizilir (TaskCards, DeliveryPosts).
 */
@Embeddable
public record PostLink(UUID deliveryId, UUID taskId) {

    static PostLink delivery(UUID deliveryId) {
        return new PostLink(deliveryId, null);
    }

    static PostLink task(UUID taskId) {
        return new PostLink(null, taskId);
    }
}
