package com.atalay.santiye.media;

import jakarta.validation.constraints.NotNull;
import org.springframework.web.multipart.MultipartFile;

/** Şantiye fotoğrafı yüklemesi (multipart). */
public record SitePhotoForm(@NotNull MultipartFile file) {
}
