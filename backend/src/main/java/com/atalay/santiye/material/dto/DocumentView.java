package com.atalay.santiye.material.dto;

import java.time.Instant;
import java.util.UUID;

/** Hareketin belgesi; url tarayıcıda doğrudan açılır (PDF, fotoğraf). */
public record DocumentView(UUID id, String fileName, String contentType, long sizeBytes, String url, Instant createdAt) {
}
