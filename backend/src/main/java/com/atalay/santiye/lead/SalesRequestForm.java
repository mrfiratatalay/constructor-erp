package com.atalay.santiye.lead;

import java.util.UUID;

/** Başvuru formunun temizlenmiş alanları. */
public record SalesRequestForm(String companyName, String contactName, String phone, String email, String city,
    Integer siteCount, UUID planId, String message) {
}
