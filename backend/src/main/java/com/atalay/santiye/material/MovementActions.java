package com.atalay.santiye.material;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.common.error.ApiException;
import com.atalay.santiye.material.dto.MovementDetail;
import com.atalay.santiye.material.dto.MovementUpdateRequest;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Kaydedilmiş hareketin sonraki adımları: teslim almak (yoldaki sevkiyat, kontrol bekleyen giriş), iptal etmek ve
 * stoğa dokunmayan bilgileri düzeltmek. Hareket silinmez; iptal geçmişte nedeniyle kalır. Stoğu değiştiren adım
 * malzemenin satırını kilitler.
 */
@Service
public class MovementActions {

    private final MaterialMovementRepository movements;
    private final MaterialRepository materials;
    private final StockLedger ledger;
    private final LoanReturns loans;
    private final MovementHistory history;
    private final MovementDetails details;

    MovementActions(MaterialMovementRepository movements, MaterialRepository materials, StockLedger ledger,
        LoanReturns loans, MovementHistory history, MovementDetails details) {
        this.movements = movements;
        this.materials = materials;
        this.ledger = ledger;
        this.loans = loans;
        this.history = history;
        this.details = details;
    }

    /** Yoldaki malzeme hedefe ulaştı ya da gelen malzeme kontrol edildi: hedefin stoğuna şimdi girer. */
    @Transactional
    public MovementDetail deliver(CurrentUser user, UUID movementId) {
        MaterialMovement movement = lock(user, movementId);
        if (!movement.getStatus().awaitsDelivery()) {
            throw ApiException.conflict("Bu hareket teslim beklemiyor.");
        }
        movement.changeStatus(MovementStatus.COMPLETED);
        history.record(movementId, MovementEventKind.DELIVERED, user, null);
        movements.flush();
        return details.of(user, movementId);
    }

    /**
     * İptal edilen hareket hiçbir stoğa dokunmaz. Hedefe girmiş malzeme oradan çıkmışsa iptal stoğu eksiye düşürürdü:
     * önce o çıkışlar düzeltilir. İadesi alınmış ödünç çıkışı, iadeleri iptal edilmeden iptal edilmez.
     */
    @Transactional
    public MovementDetail cancel(CurrentUser user, UUID movementId, String reason) {
        MaterialMovement movement = lock(user, movementId);
        if (movement.getStatus() == MovementStatus.CANCELLED) {
            throw ApiException.conflict("Bu hareket zaten iptal edildi.");
        }
        if (movement.isLoan() && loans.hasReturns(movement)) {
            throw ApiException.conflict("Bu çıkışın iadeleri var: önce iadeleri iptal et.");
        }
        if (movement.getStatus().addsToDestination() && movement.getDestinationId() != null) {
            Material material = materials.findById(movement.getMaterialId()).orElseThrow();
            ledger.requireAvailable(material, movement.getDestinationId(), movement.getQuantity());
        }
        movement.changeStatus(MovementStatus.CANCELLED);
        history.record(movementId, MovementEventKind.CANCELLED, user, MaterialTexts.tidy(reason));
        if (movement.getReturnOfId() != null) {
            movements.findById(movement.getReturnOfId()).ifPresent(loans::refresh);
        }
        movements.flush();
        return details.of(user, movementId);
    }

    @Transactional
    public MovementDetail update(CurrentUser user, UUID movementId, MovementUpdateRequest request) {
        MaterialMovement movement = find(user, movementId);
        if (movement.getStatus() == MovementStatus.CANCELLED) {
            throw ApiException.conflict("İptal edilmiş hareket düzeltilmez.");
        }
        MovementNotes before = movement.notes();
        MovementNotes after = NoteChanges.apply(movement, before, request);
        String changed = NoteChanges.describe(before, after);
        if (!changed.isEmpty()) {
            movement.annotate(after);
            history.record(movementId, MovementEventKind.UPDATED, user, changed);
        }
        movements.flush();
        return details.of(user, movementId);
    }

    private MaterialMovement lock(CurrentUser user, UUID movementId) {
        MaterialMovement movement = find(user, movementId);
        materials.lockByIdAndCompanyId(movement.getMaterialId(), user.companyId());
        return movement;
    }

    private MaterialMovement find(CurrentUser user, UUID movementId) {
        return movements.findByIdAndCompanyId(movementId, user.companyId())
            .orElseThrow(() -> ApiException.notFound("Hareket bulunamadı."));
    }
}
