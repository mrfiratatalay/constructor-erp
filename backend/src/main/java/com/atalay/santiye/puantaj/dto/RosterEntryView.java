package com.atalay.santiye.puantaj.dto;

import com.atalay.santiye.puantaj.RosterKind;
import jakarta.annotation.Nullable;
import java.util.UUID;

/**
 * Puantajın bir kalemi. name: kişinin adı ya da ekip başının adı. trade: görevi ya da ekibin iş kolu ("Demirci").
 * linked: uygulamadaki bir çalışan; adı ve numarası kendi hesabından gelir, listeden Katılımcılar'dan çıkar.
 * archived: listeden çıkmış; yalnızca istenen günlerde kaydı olduğu için görünür, işaretlenmez.
 */
public record RosterEntryView(
    UUID id,
    RosterKind kind,
    String name,
    @Nullable String trade,
    @Nullable String phone,
    boolean linked,
    boolean archived) {
}
