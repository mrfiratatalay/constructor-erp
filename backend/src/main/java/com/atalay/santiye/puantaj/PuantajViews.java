package com.atalay.santiye.puantaj;

import com.atalay.santiye.puantaj.dto.DayMarkView;
import com.atalay.santiye.puantaj.dto.RosterEntryView;

/** Puantajı dışarıya verilecek biçime çevirir; adlar ve numaralar uygulamadaki hesaplardan çözülür. */
final class PuantajViews {

    private PuantajViews() {
    }

    static RosterEntryView entryOf(RosterEntry entry, RosterPeople people) {
        return new RosterEntryView(entry.getId(), entry.getKind(), people.nameOf(entry), entry.getTrade(),
            people.phoneOf(entry), entry.isLinked(), !people.isOnList(entry));
    }

    static DayMarkView markOf(DayMark mark, RosterPeople people) {
        return new DayMarkView(mark.getEntryId(), mark.getDay(), mark.getStatus(), mark.getOvertimeHours(),
            mark.getNote(), people.nameOfUser(mark.getMarkedBy()), mark.getMarkedAt());
    }
}
