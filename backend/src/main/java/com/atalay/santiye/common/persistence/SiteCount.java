package com.atalay.santiye.common.persistence;

import java.util.UUID;

/** Şantiye başına sayım sorgularının sonucu (JPQL "select new ..." ile doldurulur). */
public record SiteCount(UUID siteId, Long count) {
}
