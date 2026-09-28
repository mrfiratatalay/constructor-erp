package com.atalay.santiye.material;

import com.atalay.santiye.common.error.ApiException;
import java.math.BigDecimal;
import java.util.EnumSet;
import java.util.Set;
import java.util.UUID;
import org.springframework.stereotype.Component;

/**
 * Ödünç verilen malzemenin geri dönüşü. İade ödünç çıkışına bağlanır; kısmi iade desteklenir: 100 verildi, 60 döndü
 * ise 40 bekler ve çıkışın durumu "Kısmi İade" olur, tamamı dönünce "İade Tamamlandı".
 */
@Component
class LoanReturns {

    private static final Set<MovementStatus> OPEN = EnumSet.of(MovementStatus.AWAITING_RETURN,
        MovementStatus.PARTIALLY_RETURNED);

    private final MaterialMovementRepository movements;

    LoanReturns(MaterialMovementRepository movements) {
        this.movements = movements;
    }

    /** İadesi beklenen ödünç çıkışı, kilitli: aynı anda gelen iki iade kalanı iki kez tüketmesin. */
    MaterialMovement requireOpenLoan(UUID companyId, UUID loanId) {
        if (loanId == null) {
            throw ApiException.badRequest("İadenin hangi ödünç çıkışına ait olduğunu seç.");
        }
        MaterialMovement loan = movements.lockByIdAndCompanyId(loanId, companyId)
            .orElseThrow(() -> ApiException.notFound("Ödünç çıkışı bulunamadı."));
        if (!loan.isLoan() || !OPEN.contains(loan.getStatus())) {
            throw ApiException.conflict("Bu çıkış iade beklemiyor.");
        }
        return loan;
    }

    BigDecimal returned(UUID loanId) {
        return movements.findByReturnOfIdAndStatusNot(loanId, MovementStatus.CANCELLED).stream()
            .map(MaterialMovement::getQuantity)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    void requireRemaining(MaterialMovement loan, BigDecimal quantity, String unit) {
        BigDecimal remaining = loan.getQuantity().subtract(returned(loan.getId()));
        if (quantity.compareTo(remaining) > 0) {
            throw ApiException.badRequest("İade miktarı bekleyen miktardan fazla olamaz: bekleyen "
                + Quantities.withUnit(remaining, unit) + ".");
        }
    }

    /** İade kaydedilince ya da iptal edilince çıkışın durumu dönen miktara göre yeniden belirlenir. */
    void refresh(MaterialMovement loan) {
        if (loan.getStatus() == MovementStatus.CANCELLED) {
            return;
        }
        BigDecimal returned = returned(loan.getId());
        if (returned.signum() == 0) {
            loan.changeStatus(MovementStatus.AWAITING_RETURN);
        } else if (returned.compareTo(loan.getQuantity()) >= 0) {
            loan.changeStatus(MovementStatus.RETURNED);
        } else {
            loan.changeStatus(MovementStatus.PARTIALLY_RETURNED);
        }
    }

    boolean hasReturns(MaterialMovement loan) {
        return !movements.findByReturnOfIdAndStatusNot(loan.getId(), MovementStatus.CANCELLED).isEmpty();
    }
}
