package com.atalay.santiye.post;

import com.atalay.santiye.common.error.ApiException;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;
import java.util.UUID;

/**
 * Akışta "bundan daha eskiler" imleci. Sayfa numarası yerine imleç: kullanıcı kaydırırken yeni gönderi gelse
 * de aynı gönderi iki kez görünmez, hiçbiri atlanmaz. Dışarıya anlamsız bir metin olarak verilir.
 */
record FeedCursor(Instant createdAt, UUID id) {

    static FeedCursor of(Post post) {
        return new FeedCursor(post.getCreatedAt(), post.getId());
    }

    String encode() {
        String raw = createdAt + "|" + id;
        return Base64.getUrlEncoder().withoutPadding().encodeToString(raw.getBytes(StandardCharsets.UTF_8));
    }

    static FeedCursor decode(String cursor) {
        try {
            String[] parts = new String(Base64.getUrlDecoder().decode(cursor), StandardCharsets.UTF_8).split("\\|");
            return new FeedCursor(Instant.parse(parts[0]), UUID.fromString(parts[1]));
        } catch (RuntimeException invalid) {
            throw ApiException.badRequest("Geçersiz sayfa imleci.");
        }
    }
}
