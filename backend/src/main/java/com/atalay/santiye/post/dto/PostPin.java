package com.atalay.santiye.post.dto;

import java.time.Instant;

/** Mesaj sabitlendiyse ne zaman ve kim sabitledi. */
public record PostPin(Instant pinnedAt, String pinnedByName) {
}
