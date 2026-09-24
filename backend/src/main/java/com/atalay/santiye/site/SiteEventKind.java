package com.atalay.santiye.site;

/**
 * Akıştaki sistem satırının türü. Artık yalnızca CREATED yazılır; MEMBER_* şantiye başına üyelik varken yazıldı
 * ve geçmişte olduğu gibi okunur ("Patron, Musa'yı ekledi").
 */
public enum SiteEventKind {
    CREATED,
    MEMBER_ADDED,
    MEMBER_REMOVED,
    /** Kişi davet bağlantısıyla kendisi katıldı; yapan da konu da odur. */
    MEMBER_JOINED
}
