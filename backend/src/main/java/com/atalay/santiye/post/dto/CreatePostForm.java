package com.atalay.santiye.post.dto;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;
import java.util.UUID;
import org.springframework.web.multipart.MultipartFile;

/**
 * Tek istekte gönderi ve dosyaları (multipart). Kimliği telefon üretir: aynı gönderi tekrar gelirse
 * yeni kayıt açılmaz. Dosyalar gönderiyle birlikte ya hep kaydedilir ya hiç. replyToId: yanıtlanan mesaj
 * (WhatsApp'taki alıntı); aynı şantiyenin bir mesajı olmalı. fieldUpdate: Saha sekmesinden yazılan saha
 * güncellemesi; sohbette de görünür. Boş gelebilir: eski sürümün telefonda bekleyen gönderisinde bu alan yoktur,
 * o gönderi düz mesajdır.
 */
public record CreatePostForm(
    @NotNull UUID id,
    @NotNull UUID siteId,
    @Nullable @Size(max = 4000) String body,
    boolean issue,
    @Nullable List<MultipartFile> files,
    @Nullable UUID replyToId,
    @Nullable Boolean fieldUpdate) {
}
