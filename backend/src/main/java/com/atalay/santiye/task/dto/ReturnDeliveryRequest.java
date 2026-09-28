package com.atalay.santiye.task.dto;

import jakarta.annotation.Nullable;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/** "Eksik var": neresi eksik, kısaca ("Buradaki kablo eksik"); isteğe bağlı olarak fotoğrafın üstünde nokta. */
public record ReturnDeliveryRequest(@NotBlank @Size(max = 300) String note, @Nullable @Valid DeliveryMark mark) {
}
