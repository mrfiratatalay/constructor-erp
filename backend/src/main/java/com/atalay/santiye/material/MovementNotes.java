package com.atalay.santiye.material;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Hareketin stoğa dokunmayan bilgileri: sonradan düzeltilebilirler. expectedReturnDate ve returnNote ödünçte,
 * usageArea kullanımda ("C Blok kolon beton"), reason ile iki miktar sayım düzeltmesinde doludur.
 */
record MovementNotes(
    LocalDate expectedReturnDate,
    String returnNote,
    String usageArea,
    String reason,
    String description,
    BigDecimal systemQuantity,
    BigDecimal countedQuantity) {

    static MovementNotes of(String description) {
        return new MovementNotes(null, null, null, null, description, null, null);
    }
}
