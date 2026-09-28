package com.atalay.santiye.post;

import java.util.UUID;

/** Teslime bağlı bir sohbet mesajı: hangi şantiyede, hangi teslimin, yazısı, yanıtladığı mesaj (varsa). */
public record DeliveryMessage(UUID siteId, UUID deliveryId, String body, UUID replyToId) {
}
