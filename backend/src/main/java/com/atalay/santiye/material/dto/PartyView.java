package com.atalay.santiye.material.dto;

import java.util.UUID;

/** Şirket dışındaki taraf: tedarikçi, müteahhit, firma ya da teslim alan kişi. */
public record PartyView(UUID id, String name) {
}
