package com.atalay.santiye.puantaj;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.UUID;

/** Bir kalemin bir günü: kalem başına günde tek kayıt. */
@Embeddable
record MarkKey(UUID entryId, LocalDate day) implements Serializable {
}
