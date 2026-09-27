package com.atalay.santiye.puantaj;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.puantaj.dto.PuantajView;
import java.time.LocalDate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** İstenen günlerin puantajı: bugünün ekranı son günleri, ayın cetveli bütün ayı ister. */
@Service
public class PuantajQueries {

    private final LedgerReader ledger;
    private final PuantajDays days;

    PuantajQueries(LedgerReader ledger, PuantajDays days) {
        this.ledger = ledger;
        this.days = days;
    }

    /** Okurken yeni katılan çalışanların kalemini de açtığı için salt okunur değildir. */
    @Transactional
    public PuantajView range(CurrentUser user, LocalDate from, LocalDate to) {
        PuantajDays.requireRange(from, to);
        Ledger book = ledger.read(user.companyId(), from, to);
        return new PuantajView(from, to, days.today(),
            book.entries().stream().map(entry -> PuantajViews.entryOf(entry, book.people())).toList(),
            book.marks().stream().map(mark -> PuantajViews.markOf(mark, book.people())).toList());
    }
}
