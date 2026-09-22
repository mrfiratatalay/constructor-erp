package com.atalay.santiye.post.dto;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.Size;

/** Çözüm notu isteğe bağlı: "Demir geldi, döküm yarın" gibi. */
public record ResolveIssueRequest(@Nullable @Size(max = 1000) String note) {
}
