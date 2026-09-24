package com.atalay.santiye.attendance;

import java.time.LocalDate;
import java.util.UUID;

/** Şantiye başına bir gün ("select new ..." ile dolar): ör. son yoklama günü. */
public record SiteDay(UUID siteId, LocalDate day) {
}
