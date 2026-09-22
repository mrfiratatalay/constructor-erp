package com.atalay.santiye.post.dto;

import jakarta.annotation.Nullable;
import java.util.UUID;

/** phone: sorunu bildireni tek dokunuşla aramak için; ekip formunda girilmediyse boş. */
public record PostAuthorRef(UUID id, String fullName, @Nullable String phone) {
}
