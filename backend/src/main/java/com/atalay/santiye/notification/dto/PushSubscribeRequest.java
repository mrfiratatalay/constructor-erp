package com.atalay.santiye.notification.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/** Tarayıcının verdiği push adresi; yalnızca tarayıcıların push servisleri kabul edilir (PushEndpoints). */
public record PushSubscribeRequest(@NotBlank @Size(max = 2048) String endpoint) {
}
