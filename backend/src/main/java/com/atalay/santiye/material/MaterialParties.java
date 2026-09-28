package com.atalay.santiye.material;

import static com.atalay.santiye.material.MaterialTexts.tidy;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.common.error.ApiException;
import com.atalay.santiye.material.dto.PartyView;
import java.time.Clock;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Şirket dışındaki taraflar. Ayrı bir firma ekranı yoktur: hareket formunda listeden seçilir ya da adı yazılır, yeni
 * ad kendiliğinden kaydedilir ("ABC İnşaat" ile "abc inşaat" aynı taraftır).
 */
@Service
public class MaterialParties {

    private final MaterialPartyRepository parties;
    private final Clock clock;

    MaterialParties(MaterialPartyRepository parties, Clock clock) {
        this.parties = parties;
        this.clock = clock;
    }

    @Transactional(readOnly = true)
    public List<PartyView> list(CurrentUser user) {
        return parties.findByCompanyIdOrderByName(user.companyId()).stream()
            .map(party -> new PartyView(party.getId(), party.getName()))
            .toList();
    }

    String nameOf(UUID partyId) {
        return parties.findById(partyId).map(MaterialParty::getName).orElse(null);
    }

    /** Seçilen taraf, yoksa yazılan ad; ikisi de boşsa taraf yok (null). */
    UUID resolve(UUID companyId, UUID partyId, String partyName) {
        if (partyId != null) {
            return parties.findByIdAndCompanyId(partyId, companyId)
                .orElseThrow(() -> ApiException.notFound("Firma bulunamadı."))
                .getId();
        }
        String name = tidy(partyName);
        if (name == null) {
            return null;
        }
        if (name.length() > 120) {
            throw ApiException.badRequest("Firma adı en çok 120 harf olabilir.");
        }
        return parties.findByName(companyId, name)
            .orElseGet(() -> parties.save(new MaterialParty(companyId, name, clock.instant())))
            .getId();
    }
}
