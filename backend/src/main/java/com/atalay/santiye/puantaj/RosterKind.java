package com.atalay.santiye.puantaj;

/**
 * Puantajda sayılanın türü. PERSON: kişi kişi takip edilen çalışan. CREW: ekip olarak takip edilen taşeron
 * ("Demirci · Hasan Usta"); patron ekibin geldiğine bakar, ekipte kaç kişi olduğuna değil.
 */
public enum RosterKind {
    PERSON,
    CREW
}
