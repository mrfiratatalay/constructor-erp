package com.atalay.santiye.billing;

import java.math.BigDecimal;

/** Paketin değiştirilebilen koşulları; visible: tanıtım sitesinde görünür mü. */
public record PlanTerms(String name, String tagline, BigDecimal monthlyPrice, Integer maxUsers, Integer maxSites,
    boolean highlighted, boolean visible, PlanStatus status) {
}
