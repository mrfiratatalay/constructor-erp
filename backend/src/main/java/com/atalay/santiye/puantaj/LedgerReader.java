package com.atalay.santiye.puantaj;

import com.atalay.santiye.common.text.TurkishOrder;
import com.atalay.santiye.tenant.Member;
import com.atalay.santiye.tenant.Members;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;

/**
 * Aralığın defterini okur. Görünen kalemler: bugün listede olanlar ve aralıkta kaydı olanlar (listeden çıkan ya
 * da şef yapılan kişinin geçmiş günleri puantajda kalır). Adlar Türkçe sıralanır: Çetin, Ceren'in ardından gelir.
 */
@Component
class LedgerReader {


    private final RosterEntryRepository entries;
    private final DayMarkRepository marks;
    private final Members members;

    LedgerReader(RosterEntryRepository entries, DayMarkRepository marks, Members members) {
        this.entries = entries;
        this.marks = marks;
        this.members = members;
    }

    /** Yazar da: uygulamaya yeni katılan çalışanların kalemini açar (RosterEntryRepository.addMissingWorkers). */
    Ledger read(UUID companyId, LocalDate from, LocalDate to) {
        entries.addMissingWorkers(companyId);
        RosterPeople people = peopleOf(companyId);
        List<DayMark> days = marks.findByCompanyIdAndIdDayBetween(companyId, from, to);
        Set<UUID> marked = days.stream().map(DayMark::getEntryId).collect(Collectors.toSet());
        List<RosterEntry> shown = entries.findByCompanyId(companyId).stream()
            .filter(entry -> people.isOnList(entry) || marked.contains(entry.getId()))
            .sorted(orderOf(people))
            .toList();
        return new Ledger(shown, days, people);
    }

    RosterPeople peopleOf(UUID companyId) {
        Map<UUID, Member> byId = members.of(companyId).stream()
            .collect(Collectors.toMap(Member::getId, Function.identity()));
        return new RosterPeople(byId);
    }

    private static Comparator<RosterEntry> orderOf(RosterPeople people) {
        Comparator<RosterEntry> byKind = Comparator.comparing(RosterEntry::getKind);
        return byKind.thenComparing(people::nameOf, TurkishOrder.NAMES);
    }
}
