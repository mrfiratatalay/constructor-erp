package com.atalay.santiye.material.dto;

import com.atalay.santiye.material.MovementType;
import java.time.LocalDate;
import java.util.UUID;

/** Malzemenin belgelerinden biri, hangi harekete ait olduğuyla ("MH-000123 · Geldi · 26 Eyl"). */
public record MaterialDocumentLine(DocumentView document, UUID movementId, long movementNumber, MovementType type,
    LocalDate day) {
}
