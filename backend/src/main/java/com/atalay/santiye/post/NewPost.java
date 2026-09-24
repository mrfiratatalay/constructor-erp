package com.atalay.santiye.post;

import java.util.UUID;

/** Yeni gönderinin bilgileri; kimliği telefon üretir. replyToId: yanıtlanan mesaj. forwarded: iletilmiş kopya. */
record NewPost(UUID id, UUID companyId, UUID siteId, UUID authorId, String body, boolean issue, UUID replyToId,
    boolean forwarded) {
}
