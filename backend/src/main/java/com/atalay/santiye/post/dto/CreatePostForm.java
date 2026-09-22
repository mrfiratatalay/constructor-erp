package com.atalay.santiye.post.dto;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;
import java.util.UUID;
import org.springframework.web.multipart.MultipartFile;

/**
 * Tek istekte gönderi ve dosyaları (multipart). Kimliği telefon üretir: aynı gönderi tekrar gelirse
 * yeni kayıt açılmaz. Dosyalar gönderiyle birlikte ya hep kaydedilir ya hiç.
 */
public record CreatePostForm(
    @NotNull UUID id,
    @NotNull UUID siteId,
    @Nullable @Size(max = 4000) String body,
    boolean issue,
    @Nullable List<MultipartFile> files) {
}
