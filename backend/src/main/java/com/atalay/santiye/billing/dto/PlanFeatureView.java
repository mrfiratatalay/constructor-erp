package com.atalay.santiye.billing.dto;

/** Paket karşılaştırmasının bir satırı: modül ve bu pakette olup olmadığı. */
public record PlanFeatureView(String key, String name, String description, boolean included) {
}
