package com.atalay.santiye.material;

import com.atalay.santiye.auth.CurrentUser;
import com.atalay.santiye.common.error.ApiException;
import com.atalay.santiye.material.dto.MovementDetail;
import com.atalay.santiye.material.dto.MovementRequest;
import java.time.Clock;
import java.time.LocalDate;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Yeni malzeme hareketini tek işlemde (atomik) kaydeder: malzemenin satırı kilitlenir, kaynakta yeterli stok
 * olduğu denetlenir, hareket ve geçmişi yazılır, iade ise ödünç çıkışının durumu güncellenir, istenirse Saha akışına
 * yansır. Aynı kimlikle tekrar gelen istek yeni kayıt açmaz, ilk kaydı döner.
 */
@Service
public class MovementRecorder {

    private final MaterialMovementRepository movements;
    private final MaterialRepository materials;
    private final MovementDrafts drafts;
    private final StockLedger ledger;
    private final LoanReturns loans;
    private final MovementHistory history;
    private final FieldReflection field;
    private final MovementDetails details;
    private final Clock clock;

    MovementRecorder(MaterialMovementRepository movements, MaterialRepository materials, MovementDrafts drafts,
        StockLedger ledger, LoanReturns loans, MovementHistory history, FieldReflection field,
        MovementDetails details, Clock clock) {
        this.movements = movements;
        this.materials = materials;
        this.drafts = drafts;
        this.ledger = ledger;
        this.loans = loans;
        this.history = history;
        this.field = field;
        this.details = details;
        this.clock = clock;
    }

    @Transactional
    public MovementDetail record(CurrentUser user, MovementRequest request) {
        if (movements.findByIdAndCompanyId(request.id(), user.companyId()).isPresent()) {
            return details.of(user, request.id());
        }
        requireRecordable(request);
        MaterialMovement loan = request.type() == MovementType.RETURN
            ? loans.requireOpenLoan(user.companyId(), request.returnOfId()) : null;
        Material material = lockActive(user.companyId(), loan == null ? request.materialId() : loan.getMaterialId());
        NewMovement draft = drafts.of(user, request, material, loan);
        if (draft.sourceId() != null) {
            ledger.requireAvailable(material, draft.sourceId(), draft.quantity());
        }
        if (loan != null) {
            loans.requireRemaining(loan, draft.quantity(), material.getUnit());
        }
        MaterialMovement saved = movements.saveAndFlush(new MaterialMovement(draft, clock.instant()));
        history.record(saved.getId(), MovementEventKind.CREATED, user, null);
        if (loan != null) {
            loans.refresh(loan);
            history.record(loan.getId(), MovementEventKind.RETURN_ADDED, user,
                Quantities.withUnit(saved.getQuantity(), material.getUnit()) + " geri geldi");
        }
        if (request.toField()) {
            field.reflect(user, saved, material);
        }
        movements.flush();
        return details.of(user, saved.getId());
    }

    /** Stoğa dokunan her iş malzemenin satırını kilitleyerek başlar (bkz. MaterialRepository). */
    Material lockActive(UUID companyId, UUID materialId) {
        if (materialId == null) {
            throw ApiException.badRequest("Malzemeyi seç.");
        }
        Material material = materials.lockByIdAndCompanyId(materialId, companyId)
            .orElseThrow(() -> ApiException.notFound("Malzeme bulunamadı."));
        if (!material.isActive()) {
            throw ApiException.badRequest(material.getName() + " pasif: yeni harekette kullanılmaz.");
        }
        return material;
    }

    private void requireRecordable(MovementRequest request) {
        if (request.type() == MovementType.ADJUSTMENT) {
            throw ApiException.badRequest("Sayım düzeltmesi stok ekranından, lokasyonun satırından yapılır.");
        }
        if (request.day().isAfter(LocalDate.now(clock))) {
            throw ApiException.badRequest("İleri bir tarihe hareket girilmez.");
        }
    }
}
