package com.atalay.santiye.team.dto;

import jakarta.annotation.Nullable;
import com.atalay.santiye.user.UserRole;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

/** lastSeenAt boşsa kişi davet linkini henüz açmamıştır. */
public record MemberView(
    UUID id,
    String fullName,
    @Nullable String phone,
    UserRole role,
    boolean active,
    @Nullable Instant lastSeenAt,
    List<UUID> siteIds) {
}
