package com.atalay.santiye.post.dto;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/** Düzeltilebilenler yalnızca yazı ve "sorun" işareti; fotoğraf yanlışsa gönderi silinip yeniden atılır. */
public record CorrectPostRequest(@Nullable @Size(max = 4000) String body, @NotNull Boolean issue) {
}
