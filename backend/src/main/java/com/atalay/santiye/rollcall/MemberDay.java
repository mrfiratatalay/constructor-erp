package com.atalay.santiye.rollcall;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.UUID;

/** Yoklamada bir kişinin bir günü: kişi başına günde tek kayıt. */
@Embeddable
record MemberDay(UUID userId, LocalDate day) implements Serializable {
}
