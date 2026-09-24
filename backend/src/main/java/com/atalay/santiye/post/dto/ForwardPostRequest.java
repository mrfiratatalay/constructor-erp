package com.atalay.santiye.post.dto;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

/** siteId: mesajın iletileceği şantiye; kişinin görebildiği bir şantiye olmalı. */
public record ForwardPostRequest(@NotNull UUID siteId) {
}
