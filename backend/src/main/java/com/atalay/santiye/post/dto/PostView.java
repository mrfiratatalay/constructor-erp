package com.atalay.santiye.post.dto;

import com.atalay.santiye.media.dto.MediaView;
import jakarta.annotation.Nullable;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record PostView(
    UUID id,
    PostSiteRef site,
    PostAuthorRef author,
    @Nullable String body,
    boolean issue,
    Instant createdAt,
    List<MediaView> media,
    @Nullable IssueResolution resolution) {
}
