package com.atalay.santiye.notification.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

/** Tarayıcının verdiği push adresi; yalnızca https kabul edilir. */
public record PushSubscribeRequest(@NotBlank @Pattern(regexp = "^https://.+") String endpoint) {
}
