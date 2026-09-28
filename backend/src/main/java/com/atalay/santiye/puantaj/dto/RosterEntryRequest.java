package com.atalay.santiye.puantaj.dto;

import com.atalay.santiye.puantaj.RosterKind;
import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * Uygulaması olmayan bir kişiyi ya da taşeron ekibi listeye eklemek. Ekipte name ekip başının adı, trade iş kolu
 * ("Demirci"). Düzeltirken tür değişmez; uygulamadaki çalışanın yalnızca görevi düzeltilir.
 */
public record RosterEntryRequest(
    @NotNull RosterKind kind,
    @NotBlank @Size(max = 120) String name,
    @Nullable @Size(max = 60) String trade,
    @Nullable @Size(max = 20) String phone) {
}
