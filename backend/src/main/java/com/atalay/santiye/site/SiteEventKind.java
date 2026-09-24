package com.atalay.santiye.site;

public enum SiteEventKind {
    CREATED,
    MEMBER_ADDED,
    MEMBER_REMOVED,
    /** Kişi davet bağlantısıyla kendisi katıldı; yapan da konu da odur. */
    MEMBER_JOINED
}
