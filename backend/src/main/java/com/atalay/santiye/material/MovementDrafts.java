package com.atalay.santiye.material;

import static com.atalay.santiye.material.MaterialTexts.tidy;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.common.error.ApiException;
import com.atalay.santiye.material.dto.MovementRequest;
import java.util.UUID;
import org.springframework.stereotype.Component;

/**
 * Formdan gelen hareketi türün kurallarına göre doğrular ve kaydedilecek hâle getirir: türün istemediği alanlar
 * atılır, lokasyonlar ve firma firmanın kendi kayıtlarından çözülür. Stok yeterliliği burada değil, kilit altında
 * (MovementRecorder) denetlenir.
 */
@Component
class MovementDrafts {

    private final StockLocations locations;
    private final MaterialParties parties;

    MovementDrafts(StockLocations locations, MaterialParties parties) {
        this.locations = locations;
        this.parties = parties;
    }

    /** loan: iadenin bağlı olduğu ödünç çıkışı; iade değilse boş. */
    NewMovement of(CurrentUser user, MovementRequest request, Material material, MaterialMovement loan) {
        MovementType type = request.type();
        UUID source = endOf(user, MovementRules.takesSource(type), request.sourceId(),
            MovementRules.missingSource(type));
        UUID destination = endOf(user, MovementRules.takesDestination(type), request.destinationId(),
            MovementRules.missingDestination(type));
        if (source != null && source.equals(destination)) {
            throw ApiException.badRequest("Nereden ve nereye aynı lokasyon olamaz.");
        }
        requireSiteDestination(user, type, destination);
        MovementPurpose purpose = type == MovementType.OUTBOUND ? requirePurpose(request.purpose()) : null;
        UUID party = partyOf(user, request, loan);
        MovementStatus status = MovementRules.initialStatus(type, purpose, request.travelling(),
            request.awaitingCheck());
        return new NewMovement(request.id(), user.companyId(), material.getId(), type, status, request.quantity(),
            source, destination, party, purpose, loan == null ? null : loan.getId(), request.day(),
            notesOf(request, purpose), user.userId());
    }

    private UUID endOf(CurrentUser user, boolean wanted, UUID locationId, String missing) {
        if (!wanted) {
            return null;
        }
        if (locationId == null) {
            throw ApiException.badRequest(missing);
        }
        return locations.require(user.companyId(), locationId).getId();
    }

    private void requireSiteDestination(CurrentUser user, MovementType type, UUID destination) {
        if (type != MovementType.TO_SITE) {
            return;
        }
        if (locations.require(user.companyId(), destination).getKind() != LocationKind.SITE) {
            throw ApiException.badRequest("Şantiyeye gönderimde hedef bir şantiye olmalı; depolar arası Transfer'dir.");
        }
    }

    private UUID partyOf(CurrentUser user, MovementRequest request, MaterialMovement loan) {
        if (loan != null) {
            return loan.getPartyId();
        }
        if (!MovementRules.takesParty(request.type())) {
            return null;
        }
        UUID party = parties.resolve(user.companyId(), request.partyId(), request.partyName());
        if (party == null && request.type() == MovementType.OUTBOUND) {
            throw ApiException.badRequest("Malzemenin verildiği firmayı seç ya da adını yaz.");
        }
        return party;
    }

    private static MovementPurpose requirePurpose(MovementPurpose purpose) {
        if (purpose == null) {
            throw ApiException.badRequest("Veriliş amacını seç: Satıldı, Ödünç Verildi ya da Destek.");
        }
        return purpose;
    }

    /** Ödünçte iade tarihi ve notu, kullanımda kullanım alanı; açıklama her türde. */
    private static MovementNotes notesOf(MovementRequest request, MovementPurpose purpose) {
        boolean loan = purpose == MovementPurpose.LOANED;
        if (loan && request.expectedReturnDate() != null && request.expectedReturnDate().isBefore(request.day())) {
            throw ApiException.badRequest("Beklenen iade tarihi veriliş tarihinden önce olamaz.");
        }
        return new MovementNotes(loan ? request.expectedReturnDate() : null, loan ? tidy(request.returnNote()) : null,
            request.type() == MovementType.USED ? tidy(request.usageArea()) : null, null, tidy(request.description()),
            null, null);
    }
}
