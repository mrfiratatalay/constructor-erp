package com.atalay.santiye.material;

import static com.atalay.santiye.material.MaterialTexts.tidy;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.common.error.ApiException;
import com.atalay.santiye.material.dto.AdjustmentRequest;
import com.atalay.santiye.material.dto.MovementDetail;
import java.math.BigDecimal;
import java.time.Clock;
import java.time.LocalDate;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Sayım düzeltmesi: fiziksel sayım sistemden farklıysa fark ayrı bir hareket olarak kaydedilir; eski hareketler
 * değişmez. Sistem miktarı, sayılan, fark ve neden hareketin üstünde kalır. Sayılan fazlaysa lokasyona giriş, azsa
 * lokasyondan çıkış olur.
 */
@Service
public class StockAdjustments {

    private final MaterialMovementRepository movements;
    private final MovementRecorder recorder;
    private final StockLocations locations;
    private final StockLedger ledger;
    private final MovementHistory history;
    private final MovementDetails details;
    private final Clock clock;

    StockAdjustments(MaterialMovementRepository movements, MovementRecorder recorder, StockLocations locations,
        StockLedger ledger, MovementHistory history, MovementDetails details, Clock clock) {
        this.movements = movements;
        this.recorder = recorder;
        this.locations = locations;
        this.ledger = ledger;
        this.history = history;
        this.details = details;
        this.clock = clock;
    }

    @Transactional
    public MovementDetail adjust(CurrentUser user, AdjustmentRequest request) {
        if (movements.findByIdAndCompanyId(request.id(), user.companyId()).isPresent()) {
            return details.of(user, request.id());
        }
        if (request.day().isAfter(LocalDate.now(clock))) {
            throw ApiException.badRequest("İleri bir tarihe sayım girilmez.");
        }
        Material material = recorder.lockActive(user.companyId(), request.materialId());
        UUID location = locations.require(user.companyId(), request.locationId()).getId();
        BigDecimal system = ledger.balance(material.getId(), location);
        BigDecimal difference = request.countedQuantity().subtract(system);
        if (difference.signum() == 0) {
            throw ApiException.badRequest("Sayım sistemle aynı: düzeltme gerekmez.");
        }
        boolean surplus = difference.signum() > 0;
        var notes = new MovementNotes(null, null, null, tidy(request.reason()), tidy(request.note()), system,
            request.countedQuantity());
        var draft = new NewMovement(request.id(), user.companyId(), material.getId(), MovementType.ADJUSTMENT,
            MovementStatus.COMPLETED, difference.abs(), surplus ? null : location, surplus ? location : null, null,
            null, null, request.day(), notes, user.userId());
        MaterialMovement saved = movements.saveAndFlush(new MaterialMovement(draft, clock.instant()));
        history.record(saved.getId(), MovementEventKind.CREATED, user, "Sistem " + Quantities.format(system)
            + ", sayılan " + Quantities.format(request.countedQuantity()));
        movements.flush();
        return details.of(user, saved.getId());
    }
}
