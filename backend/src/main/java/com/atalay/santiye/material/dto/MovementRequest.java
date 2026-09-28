package com.atalay.santiye.material.dto;

import com.atalay.santiye.material.MovementPurpose;
import com.atalay.santiye.material.MovementType;
import jakarta.annotation.Nullable;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

/**
 * Yeni malzeme hareketi. Kimliği istemci üretir: bağlantı kopup istek tekrar gelirse ikinci kayıt açılmaz. Türün
 * istemediği alanlar yok sayılır (Kullanıldı'da hedef, Geldi'de kaynak yoktur). Firma listeden seçilir (partyId) ya da
 * adı yazılır (partyName). İade bir ödünç çıkışına bağlanır (returnOfId); malzemesi ve firması oradan gelir.
 * inTransit: şantiyeye gönderim ve transfer henüz teslim edilmedi (Yolda). pendingCheck: gelen malzeme henüz kontrol
 * edilmedi. İkisinde de hedefin stoğu teslimde artar. reflectToField: şantiye ilişkili hareket Saha akışına yansır.
 * Üç bayrak da boş bırakılırsa "hayır" sayılır.
 */
public record MovementRequest(
    @NotNull UUID id,
    @NotNull MovementType type,
    @Nullable UUID materialId,
    @NotNull @Positive @Digits(integer = 11, fraction = 3) BigDecimal quantity,
    @Nullable UUID sourceId,
    @Nullable UUID destinationId,
    @Nullable UUID partyId,
    @Nullable @Size(max = 120) String partyName,
    @Nullable MovementPurpose purpose,
    @Nullable UUID returnOfId,
    @NotNull LocalDate day,
    @Nullable LocalDate expectedReturnDate,
    @Nullable @Size(max = 300) String returnNote,
    @Nullable @Size(max = 120) String usageArea,
    @Nullable @Size(max = 500) String description,
    @Nullable Boolean inTransit,
    @Nullable Boolean pendingCheck,
    @Nullable Boolean reflectToField) {

    public boolean travelling() {
        return Boolean.TRUE.equals(inTransit);
    }

    public boolean awaitingCheck() {
        return Boolean.TRUE.equals(pendingCheck);
    }

    public boolean toField() {
        return Boolean.TRUE.equals(reflectToField);
    }
}
