package com.atalay.santiye.post;

import java.util.UUID;

/** Görev kartı mesajı: hangi şantiyede, hangi görevin, yazısı ve (görev bir mesajdan açıldıysa) o mesaj. */
public record TaskCardMessage(UUID siteId, UUID taskId, String body, UUID replyToId) {
}
