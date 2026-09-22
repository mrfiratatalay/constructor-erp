package com.atalay.santiye.post.dto;

import jakarta.annotation.Nullable;
import java.util.List;

/** nextCursor boşsa daha eski gönderi yoktur. */
public record PostPage(List<PostView> items, @Nullable String nextCursor) {
}
