package com.atalay.santiye.material;

import static com.atalay.santiye.material.MaterialTexts.tidy;

import com.atalay.santiye.common.error.ApiException;
import com.atalay.santiye.material.dto.MovementUpdateRequest;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * Hareketin notlarının düzeltilmesi: yalnızca türün taşıdığı alanlar değişir (iade tarihi ödünçte, kullanım alanı
 * kullanımda). Geçmişe ne değiştiği yazılır: "Açıklama, beklenen iade tarihi değişti".
 */
final class NoteChanges {

    private NoteChanges() {
    }

    static MovementNotes apply(MaterialMovement movement, MovementNotes before, MovementUpdateRequest request) {
        boolean loan = movement.isLoan();
        boolean used = movement.getType() == MovementType.USED;
        if (loan && request.expectedReturnDate() != null && request.expectedReturnDate().isBefore(movement.day())) {
            throw ApiException.badRequest("Beklenen iade tarihi veriliş tarihinden önce olamaz.");
        }
        return new MovementNotes(loan ? request.expectedReturnDate() : before.expectedReturnDate(),
            loan ? tidy(request.returnNote()) : before.returnNote(),
            used ? tidy(request.usageArea()) : before.usageArea(), before.reason(), tidy(request.description()),
            before.systemQuantity(), before.countedQuantity());
    }

    static String describe(MovementNotes before, MovementNotes after) {
        List<String> changed = new ArrayList<>();
        addIf(changed, before.description(), after.description(), "açıklama");
        addIf(changed, before.usageArea(), after.usageArea(), "kullanım alanı");
        addIf(changed, before.expectedReturnDate(), after.expectedReturnDate(), "beklenen iade tarihi");
        addIf(changed, before.returnNote(), after.returnNote(), "geri dönüş notu");
        if (changed.isEmpty()) {
            return "";
        }
        String list = String.join(", ", changed);
        return Character.toUpperCase(list.charAt(0)) + list.substring(1) + " değişti";
    }

    private static void addIf(List<String> changed, Object before, Object after, String label) {
        if (!Objects.equals(before, after)) {
            changed.add(label);
        }
    }
}
