package com.atalay.santiye.post.dto;

import java.time.Instant;

/** Silinen gönderinin izi: kim, ne zaman sildi. */
public record PostDeletion(Instant deletedAt, String deletedByName) {
}
