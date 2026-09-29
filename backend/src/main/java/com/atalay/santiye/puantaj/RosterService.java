package com.atalay.santiye.puantaj;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.common.error.ApiException;
import com.atalay.santiye.puantaj.dto.RosterEntryRequest;
import com.atalay.santiye.puantaj.dto.RosterEntryView;
import com.atalay.santiye.team.PersonNames;
import com.atalay.santiye.team.PhoneNumbers;
import java.time.Clock;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Listenin kalemleri. Şef ya da patron uygulaması olmayan bir kişiyi ya da taşeron ekibi adıyla ekler, düzeltir,
 * listeden çıkarır. Uygulamadaki çalışan listeye kendiliğinden girer; adı ve numarası hesabından gelir, burada
 * yalnızca görevi düzeltilir. Onu listeden çıkarmak Katılımcılar'ın işidir (firmadan çıkar ya da şef yap).
 */
@Service
public class RosterService {

    private final RosterEntryRepository entries;
    private final LedgerReader ledger;
    private final Clock clock;

    RosterService(RosterEntryRepository entries, LedgerReader ledger, Clock clock) {
        this.entries = entries;
        this.ledger = ledger;
        this.clock = clock;
    }

    @Transactional
    public RosterEntryView add(CurrentUser user, RosterEntryRequest request) {
        RosterEntry entry = new RosterEntry(user.companyId(), request.kind(), clock.instant());
        describe(entry, request);
        return PuantajViews.entryOf(entries.save(entry), ledger.peopleOf(user.companyId()));
    }

    @Transactional
    public RosterEntryView update(CurrentUser user, UUID entryId, RosterEntryRequest request) {
        RosterEntry entry = require(user.companyId(), entryId);
        if (entry.isLinked()) {
            entry.describe(entry.getName(), MarkRules.tidy(request.trade()), entry.getPhone());
        } else {
            describe(entry, request);
        }
        return PuantajViews.entryOf(entry, ledger.peopleOf(user.companyId()));
    }

    @Transactional
    public void archive(CurrentUser user, UUID entryId) {
        RosterEntry entry = require(user.companyId(), entryId);
        if (entry.isLinked()) {
            throw ApiException.badRequest(
                "Uygulamadaki çalışan buradan çıkarılmaz: Katılımcılar'dan firmadan çıkar ya da şef yap.");
        }
        entry.archive(clock.instant());
    }

    /**
     * Firmanın taşeron ekipleri: imalatın taşeronu buradan seçilir (firmada tek taşeron listesi). Listeden çıkmış
     * ekip de gelir (archived): eski imalatın taşeronu adıyla görünmeye devam eder.
     */
    @Transactional(readOnly = true)
    public List<RosterEntryView> crews(UUID companyId) {
        RosterPeople people = ledger.peopleOf(companyId);
        return entries.findByCompanyId(companyId).stream()
            .filter(entry -> entry.getKind() == RosterKind.CREW)
            .map(entry -> PuantajViews.entryOf(entry, people))
            .toList();
    }

    /** İşaretlenecek kalem: firmanın ve bugün listede. Listeden çıkmış kalemin geçmiş günleri değişmez. */
    RosterEntry requireMarkable(UUID companyId, UUID entryId, RosterPeople people) {
        RosterEntry entry = require(companyId, entryId);
        if (!people.isOnList(entry)) {
            throw ApiException.conflict("Listeden çıkmış kişi işaretlenemez.");
        }
        return entry;
    }

    private RosterEntry require(UUID companyId, UUID entryId) {
        return entries.findByIdAndCompanyId(entryId, companyId)
            .orElseThrow(() -> ApiException.notFound("Listede böyle biri yok."));
    }

    private static void describe(RosterEntry entry, RosterEntryRequest request) {
        String phone = MarkRules.tidy(request.phone());
        if (phone != null && !PhoneNumbers.looksValid(phone)) {
            throw ApiException.badRequest("Telefon numarası hatalı.");
        }
        entry.describe(PersonNames.tidy(request.name()), MarkRules.tidy(request.trade()), phone);
    }
}
