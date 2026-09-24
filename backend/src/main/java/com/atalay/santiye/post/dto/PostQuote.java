package com.atalay.santiye.post.dto;

import com.atalay.santiye.media.MediaKind;
import jakarta.annotation.Nullable;
import java.util.UUID;

/**
 * Yanıtlanan mesajın baloncuğun üstündeki alıntısı: kimin, ilk satırı ya da ne gönderdiği, varsa küçük resmi.
 * deleted: alıntılanan mesaj sonradan silindi; alıntı "silinen mesaj" diye okunur.
 */
public record PostQuote(
    UUID id,
    String authorName,
    @Nullable String body,
    @Nullable MediaKind mediaKind,
    @Nullable String thumbnailUrl,
    boolean deleted) {
}
