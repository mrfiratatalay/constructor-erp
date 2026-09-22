package com.atalay.santiye.post.dto;

import jakarta.annotation.Nullable;
import java.time.Instant;

public record IssueResolution(Instant resolvedAt, String resolvedByName, @Nullable String note) {
}
