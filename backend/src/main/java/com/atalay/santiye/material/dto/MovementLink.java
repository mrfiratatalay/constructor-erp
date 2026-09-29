package com.atalay.santiye.material.dto;

import java.util.UUID;

/** Başka bir harekete bağlantı (iadenin ödünç çıkışı gibi). */
public record MovementLink(UUID id, long number) {
}
