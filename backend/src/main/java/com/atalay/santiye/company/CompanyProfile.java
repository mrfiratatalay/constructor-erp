package com.atalay.santiye.company;

/** Firmanın dışarıya görünen bilgileri: çalışma alanında ad, platform yönetiminde iletişim. */
public record CompanyProfile(String name, String phone, String email, String city) {
}
