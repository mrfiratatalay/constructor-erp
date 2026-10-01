package com.atalay.santiye.puantaj;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.puantaj.dto.BulkMarkRequest;
import com.atalay.santiye.puantaj.dto.DayMarkView;
import com.atalay.santiye.puantaj.dto.MarkRequest;
import java.time.Clock;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Günü işaretlemek. Her seçim anında kaydedilir; ayrı bir "Kaydet" ya da "Tamamla" yoktur. Kim, ne zaman
 * işaretlediği yazılır. İşaret kaldırılınca gün yeniden "İşaretlenmedi" olur.
 */
@Service
public class PuantajMarks {

    private final DayMarkRepository marks;
    private final RosterService roster;
    private final LedgerReader ledger;
    private final PuantajDays days;
    private final Clock clock;

    PuantajMarks(DayMarkRepository marks, RosterService roster, LedgerReader ledger, PuantajDays days, Clock clock) {
        this.marks = marks;
        this.roster = roster;
        this.ledger = ledger;
        this.days = days;
        this.clock = clock;
    }

    @Transactional
    public DayMarkView mark(CurrentUser user, LocalDate day, UUID entryId, MarkRequest request) {
        days.requireEditable(user, day);
        RosterPeople people = ledger.peopleOf(user.companyId());
        RosterEntry entry = roster.requireMarkable(user.companyId(), entryId, people);
        Marking marking = MarkRules.checked(entry.getKind(), request);
        DayMark mark = markOf(user, day, entryId);
        mark.record(marking, user.userId(), clock.instant());
        return PuantajViews.markOf(marks.save(mark), people);
    }

    /**
     * Şefin seçtikleri tek hamlede: bir kalem kurala uymazsa hiçbiri kaydedilmez. Satırlar hep aynı sırada kilitlenir
     * (kimliğe göre): iki şefin aynı kişileri farklı sırayla seçtiği toplu işaretler birbirini kilitlemesin.
     */
    @Transactional
    public List<DayMarkView> markAll(CurrentUser user, LocalDate day, BulkMarkRequest request) {
        days.requireEditable(user, day);
        RosterPeople people = ledger.peopleOf(user.companyId());
        return request.entryIds().stream().distinct().sorted().map(entryId -> {
            RosterEntry entry = roster.requireMarkable(user.companyId(), entryId, people);
            MarkRules.requireStatus(entry.getKind(), request.status());
            DayMark mark = markOf(user, day, entryId);
            mark.changeStatus(request.status(), user.userId(), clock.instant());
            return PuantajViews.markOf(marks.save(mark), people);
        }).toList();
    }

    @Transactional
    public void clear(CurrentUser user, LocalDate day, UUID entryId) {
        days.requireEditable(user, day);
        roster.requireMarkable(user.companyId(), entryId, ledger.peopleOf(user.companyId()));
        marks.deleteById(new MarkKey(entryId, day));
    }

    private DayMark markOf(CurrentUser user, LocalDate day, UUID entryId) {
        MarkKey key = new MarkKey(entryId, day);
        return marks.findById(key).orElseGet(() -> new DayMark(key, user.companyId()));
    }
}
