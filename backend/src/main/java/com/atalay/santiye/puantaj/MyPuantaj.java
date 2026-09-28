package com.atalay.santiye.puantaj;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.puantaj.dto.MyDayView;
import com.atalay.santiye.puantaj.dto.MyPuantajView;
import com.atalay.santiye.user.AppUser;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Puantajım: çalışan kendi ayını görür, itiraz ay sonunda değil o gün, şef hatırlarken çıkar. Yalnızca kendi
 * kaydı; şefin notu değil, işaretleyenin adı ve numarası (yanlışsa arar). Kayıt işaretlendiği anda görünür.
 */
@Service
public class MyPuantaj {

    private final RosterEntryRepository entries;
    private final DayMarkRepository marks;
    private final LedgerReader ledger;
    private final PuantajDays days;

    MyPuantaj(RosterEntryRepository entries, DayMarkRepository marks, LedgerReader ledger, PuantajDays days) {
        this.entries = entries;
        this.marks = marks;
        this.ledger = ledger;
        this.days = days;
    }

    /** Yeni katılan çalışanın kalemi henüz açılmamış olabilir: önce açılır (salt okunur değildir). */
    @Transactional
    public MyPuantajView month(CurrentUser user, YearMonth month) {
        LocalDate from = month.atDay(1);
        LocalDate to = month.atEndOfMonth();
        entries.addMissingWorkers(user.companyId());
        RosterPeople people = ledger.peopleOf(user.companyId());
        Optional<RosterEntry> mine = entries.findByUserId(user.userId());
        List<MyDayView> own = mine.map(entry -> marksOf(entry, from, to)).orElse(List.of()).stream()
            .map(mark -> dayOf(mark, people))
            .toList();
        boolean counted = mine.map(people::isOnList).orElse(false);
        return new MyPuantajView(from, to, days.today(), counted, own);
    }

    private List<DayMark> marksOf(RosterEntry entry, LocalDate from, LocalDate to) {
        return marks.findByIdEntryIdAndIdDayBetweenOrderByIdDay(entry.getId(), from, to);
    }

    private static MyDayView dayOf(DayMark mark, RosterPeople people) {
        AppUser marker = people.byId().get(mark.getMarkedBy());
        return new MyDayView(mark.getDay(), mark.getStatus(), mark.getOvertimeHours(),
            people.nameOfUser(mark.getMarkedBy()), marker == null ? null : marker.getPhone(), mark.getMarkedAt());
    }
}
