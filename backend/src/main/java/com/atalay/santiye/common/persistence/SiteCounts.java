package com.atalay.santiye.common.persistence;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

public final class SiteCounts {

    private SiteCounts() {
    }

    public static Map<UUID, Long> toMap(List<SiteCount> counts) {
        return counts.stream().collect(Collectors.toMap(SiteCount::siteId, SiteCount::count));
    }
}
