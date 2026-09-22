package com.atalay.santiye.visit.dto;

import jakarta.annotation.Nullable;
import java.time.Instant;

/** previousSeenAt: bu ziyaretten önceki son bakış; boşsa kişi şantiyeye ilk kez bakıyor. */
public record SiteVisitView(@Nullable Instant previousSeenAt) {
}
